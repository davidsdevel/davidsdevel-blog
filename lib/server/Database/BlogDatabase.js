const convert = require('xml-js');

class BlogDatabase {
  /**
	 * @constructor
	 *
	 * @param {Boolean} dev
	 */
  constructor(dev) {
    this.idDev = dev;

    this.jobs = {};
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
      const data = convert.xml2js(xml, { compact: true });

      const promises = data.feed.entry.map(async (e) => {
        if (!/\.post-/.test(e.id._text)) { return undefined; }

        let tags = [];
        let url = null;
        let image = null;

        if (Array.isArray(e.category)) {
          tags = e.category
            .map((cat) => (/https?:\/\/schemas\.google\.com\//.test(cat._attributes.scheme) ? [] : cat._attributes.term.replace(/,/g, '')))
            .filter((a) => a);
        }

        e.link.forEach((link) => {
          if (link._attributes.rel === 'alternate') { url = link._attributes.href.replace(/https?:\/\/\w*\.blogspot\.com(\/\d*)*\//, '').replace('.html', ''); }
        });

        if (e.content) {
          if (e.content._text) {
            const match = e.content._text.match(/<img.*=.*\/><\/a/);

            if (match) {
              const matchImage = convert.xml2js(`${match[0].split('/></a')[0]}/>`);
              image = matchImage.elements[0].attributes.src;
            }
          }
        }

        const data = {
          title: e.title._text,
          image,
          comments: 0,
          views: 0,
          published: !e['app:control'] ? new Date(e.published._text) : null,
          created: new Date(e.published._text),
          updated: new Date(e.updated._text),
          content: e.content._text || null,
          tags: tags.join(', '),
          url,
          postStatus: 'imported',
        };

        const rows = await this.db.where({ created: new Date(e.published._text) }).orWhere({ title: e.title._text || '' }).orWhere({ url: url || '' }).select('title')
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
      const data = convert.xml2js(xml, { compact: true });

      const promises = data.rss.channel.item.map(async (e) => {
        if (e['wp:post_type']._cdata !== 'post') { return null; }

        const title = e.title._text;
        const description = e.description._text ? e.description._text : '';
        const content = e['content:encoded']._cdata ? e['content:encoded']._cdata : '';
        const url = e['wp:post_name']._cdata || '';
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
          tags: Array.isArray(e.category) ? e.category.map((cat) => cat._cdata).join(',') : '',
          url,
          postStatus: 'imported',
        };
        const rows = await this.db.where({ created }).orWhere({ title }).orWhere({ url }).select('title')
          .from('posts');

        if (rows.length === 0) { return this.db('posts').insert(data); }
        return null;
      });

      return Promise.all(promises);
    } catch (err) {
      console.error(err);
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
        hours: {},
        days: {},
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

      for (let i = 29; i >= 0; i--) {
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

        time = new Date(time);

        // Set Views Per Day
        if (time > limit) {
          const month = time.getMonth() + 1;
          const date = time.getDate();

          const path = `${date < 10 ? `0${date}` : date}-${month < 10 ? `0${month}` : month}`;

          const generalViews = general.viewsPerDay[path];

          if (!generalViews) { general.viewsPerDay[path] = 1; } else { general.viewsPerDay[path] = generalViews + 1; }
        }

        // Set General Time Views

        let hour = time.getHours();

        if (hour < 12) { hour = `${hour}AM`; } else if (hour === 12) { hour = `${hour}M`; } else if (hour > 12) { hour = `${hour - 12}PM`; } else if (hour === 0) { hour = '12AM'; }

        const origin = urlRegExp.test(referer) ? referer.match(urlRegExp)[0] : 'desconocido';

        const dayIndex = time.getDay();

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
        }

        const generalHour = general.hours[hour];
        const generalLocation = general.locations[country];
        const generalOS = general.os[os];
        const generalOrigin = general.origins[referer];
        const generalBrowser = general.browsers[browser];
        const generalDay = general.days[day];

        if (!generalHour) { general.hours[hour] = 1; } else { general.hours[hour] = generalHour + 1; }

        // Set General Location Views

        if (!generalLocation) { general.locations[country] = 1; } else { general.locations[country] = generalLocation + 1; }

        // Set General OS Views

        if (!generalOS) { general.os[os] = 1; } else { general.os[os] = generalOS + 1; }

        if (!generalBrowser) { general.browsers[browser] = 1; } else { general.browsers[browser] = generalBrowser + 1; }

        // Set General Origin Views

        if (!generalOrigin) { general.origins[origin] = 1; } else { general.origins[origin] = generalOrigin + 1; }

        // Set General Day Views
        if (!generalDay) { general.days[day] = 1; } else { general.days[day] = generalDay + 1; }
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

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];

      try {
        await this.db('blog').where({
          key: e[0],
        }).update({
          value: e[1],
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.resolve();
  }

  async _blogMetadata(key) {
    try {
      const rows = await this.db.select('value').from('blog').where({ key });

      return Promise.resolve(rows[0].value);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  getUrlID() {
    return this._blogMetadata('url');
  }

  getBlogTitle() {
    return this._blogMetadata('title');
  }

  getBlogDescription() {
    return this._blogMetadata('description');
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
      const categories = await this._blogMetadata('categories');

      return Promise.resolve(JSON.parse(categories));
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = BlogDatabase;
