const convert = require('xml-js');

class BlogDatabase {
  /**
   * @constructor
   */
  constructor() {
    this.jobs = {};
  }

  /**
   * Is Installed
   *
   * @description Return Blog Status
   * @public
   *
   * @return {Promise<Boolean>}
   */
  async isInstalled() {
    try {
      const rows = await this.db('blog').select("value").where({key: 'installed'});

      return Promise.resolve(rows[0].value === 'true');
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Add Category
   *
   * @param {String} name
   * @param {String} alias
   *
   *
   * return {Promise<String|Error>}
   */
  async addCategory(name, alias) {
    try {
      const rows = await this.db.select('*').from('blog').where({ key: 'categories' });

      const data = JSON.parse(rows[0].value);

      data.push({ name, alias });

      await this.db('blog').update({
        value: JSON.stringify(data),
      }).where({ key: 'categories' });

      return Promise.resolve('success');
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Delete Category
   *
   * @param {String} name
   *
   * @return {Promise<String|Error>}
   */
  async deleteCategory(name) {
    try {
      const rows = await this.db.select('*').from('blog').where({ key: 'categories' });

      let data = JSON.parse(rows[0].value);

      data = data.filter((e) => e.name !== name);

      await this.db('blog').update({
        value: JSON.stringify(data),
      }).where({ key: 'categories' });

      return Promise.resolve('success');
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Import Posts From JSON
   *
   * @public
   *
   * @param {Object} data
   *
   * @return {Promise}
   */
  importPostsFromJson(data) {
    return new Promise((resolve, reject) => {
      data.forEach(async (e) => {
        try {
          const rows = await this.db('posts').select('*').where('url', e.url || '').orWhere('title', e.title)
            .orWhere('published', e.published);

          if (rows.length === 0) { await this.db('posts').insert(e); }
        } catch (err) {
          reject(err);
        }
      });
      resolve();
    });
  }

  /**
   * Import Posts From Blogger
   *
   * @public
   *
   * @param {String} xml
   *
   * @return {Promise}
   */
  importPostsFromBlogger(xml) {
    try {
      const JSONdata = convert.xml2js(xml, { compact: true });

      const promises = JSONdata.feed.entry.map(async (e) => {
        // eslint-disable-next-line
        if (!/\.post-/.test(e.id._text)) { return undefined; }

        let tags = [];
        let url = null;
        let image = null;

        if (Array.isArray(e.category)) {
          tags = e.category
            // eslint-disable-next-line
            .map((cat) => (/https?:\/\/schemas\.google\.com\//.test(cat._attributes.scheme) ? [] : cat._attributes.term.replace(/,/g, '')))
            .filter((a) => a);
        }

        e.link.forEach((link) => {
          // eslint-disable-next-line
          if (link._attributes.rel === 'alternate') {
            // eslint-disable-next-line
            url = link._attributes.href
              .replace(/https?:\/\/\w*\.blogspot\.com(\/\d*)*\//, '')
              .replace('.html', '');
          }
        });

        if (e.content) {
          // eslint-disable-next-line
          if (e.content._text) {
            // eslint-disable-next-line
            const match = e.content._text.match(/<img.*=.*\/><\/a/);

            if (match) {
              const matchImage = convert.xml2js(`${match[0].split('/></a')[0]}/>`);
              image = matchImage.elements[0].attributes.src;
            }
          }
        }

        const data = {
          // eslint-disable-next-line
          title: e.title._text,
          image,
          comments: 0,
          views: 0,
          // eslint-disable-next-line
          published: !e['app:control'] ? new Date(e.published._text) : null,
          // eslint-disable-next-line
          created: new Date(e.published._text),
          // eslint-disable-next-line
          updated: new Date(e.updated._text),
          // eslint-disable-next-line
          content: e.content._text || null,
          tags: tags.join(', '),
          url,
          postStatus: 'imported',
        };

        const rows = await this.db
          // eslint-disable-next-line
          .where({ created: new Date(e.published._text) })
          // eslint-disable-next-line
          .orWhere({ title: e.title._text || '' })
          .orWhere({ url: url || '' })
          .select('title')
          .from('posts');

        if (rows.length === 0) { return this.db('posts').insert(data); }
        return null;
      });

      return Promise.all(promises);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Import Posts From WordPress
   *
   * @public
   *
   * @param {String} xml
   *
   * @return {Promise}
   */
  importPostsFromWordPress(xml) {
    try {
      const JSONdata = convert.xml2js(xml, { compact: true });

      const promises = JSONdata.rss.channel.item.map(async (e) => {
        // eslint-disable-next-line
        if (e['wp:post_type']._cdata !== 'post') { return null; }

        // eslint-disable-next-line
        const title = e.title._text;
        // eslint-disable-next-line
        const description = e.description._text ? e.description._text : '';
        // eslint-disable-next-line
        const content = e['content:encoded']._cdata ? e['content:encoded']._cdata : '';
        // eslint-disable-next-line
        const url = e['wp:post_name']._cdata || '';
        // eslint-disable-next-line
        const published = new Date(e.pubDate._text);
        let image = '';

        const match = content.match(/<img.*height="\d*"\s\/>/);

        if (match) {
          const matchImage = convert.xml2js(`${match[0].split('/>')[0]}/>`);

          image = matchImage.elements[0].attributes.src.replace(/-\d*x\d*(?=\.\w*$)/, '');
        }

        const data = {
          title,
          image,
          description,
          comments: 0,
          views: 0,
          published,
          created: published,
          updated: published,
          content,
          // eslint-disable-next-line
          tags: Array.isArray(e.category) ? e.category.map((cat) => cat._cdata).join(',') : '',
          url,
          postStatus: 'imported',
        };
        const rows = await this.db.where({ created: published }).orWhere({ title }).orWhere({ url }).select('title')
          .from('posts');

        if (rows.length === 0) { return this.db('posts').insert(data); }
        return null;
      });

      return Promise.all(promises);
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  async getStats() {
    try {
      const dateNow = new Date();

      const nowYear = dateNow.getFullYear();
      const nowMonth = dateNow.getMonth();
      const nowDate = dateNow.getDate();

      const limit = new Date(nowYear, nowMonth, nowDate) - (1000 * 60 * 60 * 24 * 30);

      const general = {
        viewsPerDay: {},
        hours: {
          '1AM': 0,
          '2AM': 0,
          '3AM': 0,
          '4AM': 0,
          '5AM': 0,
          '6AM': 0,
          '7AM': 0,
          '8AM': 0,
          '9AM': 0,
          '10AM': 0,
          '11AM': 0,
          '12M': 0,
          '1PM': 0,
          '2PM': 0,
          '3PM': 0,
          '4PM': 0,
          '5PM': 0,
          '6PM': 0,
          '7PM': 0,
          '8PM': 0,
          '9PM': 0,
          '10PM': 0,
          '11PM': 0,
          '12AM': 0,
        },
        days: {
          Domingo: 0,
          Lunes: 0,
          Martes: 0,
          Miercoles: 0,
          Jueves: 0,
          Viernes: 0,
          Sábado: 0,
        },
        locations: {},
        os: {},
        browsers: {},
        origins: {},
        subscriptors: 0,
      };

      const views = await this.db('views').select('*');

      if (views.length === 0) { return Promise.resolve({}); }

      const posts = await this.db('posts').where({ postStatus: 'published' }).select('views', 'image', 'comments', 'url', 'title', 'tags', 'description');
      const users = await this.db('users').select('email');

      // Set default day views values
      const now = Date.now();

      for (let i = 29; i >= 0; i -= 1) {
        const time = new Date(now - (i * 1000 * 60 * 60 * 24));
        const month = time.getMonth() + 1;
        const date = time.getDate();

        const path = `${date < 10 ? `0${date}` : date}-${month < 10 ? `0${month}` : month}`;

        general.viewsPerDay[path] = 0;
      }

      views.forEach(({
        time, referer, os, browser, country,
      }) => {
        const urlRegExp = /https?:\/\/(\w*\.)*\w*/;

        const timeData = new Date(time);

        // Set Views Per Day
        if (timeData > limit) {
          const month = timeData.getMonth() + 1;
          const date = timeData.getDate();

          const path = `${date < 10 ? `0${date}` : date}-${month < 10 ? `0${month}` : month}`;

          const generalViews = general.viewsPerDay[path];

          if (!generalViews) {
            general.viewsPerDay[path] = 1;
          } else {
            general.viewsPerDay[path] = generalViews + 1;
          }
        }

        // Set General Time Views

        let hour = timeData.getHours();

        if (hour < 12) {
          hour = `${hour}AM`;
        } else if (hour === 12) {
          hour = `${hour}M`;
        } else if (hour > 12) {
          hour = `${hour - 12}PM`;
        } else if (hour === 0) {
          hour = '12AM';
        }

        const origin = urlRegExp.test(referer) ? referer.match(urlRegExp)[0] : 'desconocido';

        const dayIndex = timeData.getDay();

        let day;

        switch (dayIndex) {
          case 0:
            day = 'Domingo';
            break;
          case 1:
            day = 'Lunes';
            break;
          case 2:
            day = 'Martes';
            break;
          case 3:
            day = 'Miercoles';
            break;
          case 4:
            day = 'Jueves';
            break;
          case 5:
            day = 'Viernes';
            break;
          case 6:
            day = 'Sábado';
            break;
          default: break;
        }

        const generalHour = general.hours[hour];
        const generalLocation = general.locations[country];
        const generalOS = general.os[os];
        const generalOrigin = general.origins[referer];
        const generalBrowser = general.browsers[browser];
        const generalDay = general.days[day];

        if (!generalHour) {
          general.hours[hour] = 1;
        } else {
          general.hours[hour] = generalHour + 1;
        }

        // Set General Location Views

        if (!generalLocation) {
          general.locations[country] = 1;
        } else {
          general.locations[country] = generalLocation + 1;
        }

        // Set General OS Views

        if (!generalOS) {
          general.os[os] = 1;
        } else {
          general.os[os] = generalOS + 1;
        }

        if (!generalBrowser) {
          general.browsers[browser] = 1;
        } else {
          general.browsers[browser] = generalBrowser + 1;
        }

        // Set General Origin Views

        if (!generalOrigin) {
          general.origins[origin] = 1;
        } else {
          general.origins[origin] = generalOrigin + 1;
        }

        // Set General Day Views
        if (!generalDay) {
          general.days[day] = 1;
        } else {
          general.days[day] = generalDay + 1;
        }
      });
      users.forEach(({ email }) => {
        const { subscriptors } = general;

        if (email) { general.subscriptors = subscriptors + 1; }
      });

      const mostView = await this.getMostViewed();
      const mostCommented = await this.getMostCommented();

      return Promise.resolve({
        general,
        posts,
        mostView,
        mostCommented,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async saveConfig(data) {
    const entries = Object.entries(data);
    const updatePromises = [];

    for (let i = 0; i < entries.length; i += 1) {
      const e = entries[i];

      const promise = this.db('blog').where({
        key: e[0],
      }).update({
        value: e[1],
      });

      updatePromises.push(promise);
    }
    return Promise.all(updatePromises);
  }

  async blogMetadata(key) {
    try {
      const rows = await this.db.select('value').from('blog').where({ key });

      return Promise.resolve(rows[0].value);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  getUrlID() {
    return this.blogMetadata('url');
  }

  getBlogTitle() {
    return this.blogMetadata('title');
  }

  getBlogDescription() {
    return this.blogMetadata('description');
  }

  /**
   * Get Categories
   *
   * @public
   *
   * @return {Promise<Object|Error>}
   *
   */
  async getCategories() {
    try {
      const categories = await this.blogMetadata('categories');

      return Promise.resolve(JSON.parse(categories));
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = BlogDatabase;
