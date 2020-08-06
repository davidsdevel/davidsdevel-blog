const Database = require('./FileDatabase');
const Mail = require('../Mail');
/*
const Notification = require('../SendNotification');
const mailer = new Mail();
*/

class PostsDatabase extends Database {
  constructor() {
    super();

    this.mailer = new Mail(this); 
  }
  /**
   * Get Post By Title
   *
   * @public
   *
   * @param {String} url
   *
   * @return {Promise<Object|String>}
   *
   */
  async getPostByTitle(url) {
    try {
      const req = await this.db.where({ url }).select('*').from('posts');

      if (req.length === 0) { return Promise.resolve('dont-exists'); }
      return Promise.resolve(this.filterPosts(req[0]));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Get Post By Category
   *
   * @public
   *
   * @param {String} category
   * @param {String} url
   *
   * @return {Promise<Object|String>}
   *
   */
  async getPostByCategory(category, url) {
    try {
      const req = await this.db.where({ category, url }).select('*').from('posts');
      if (req.length === 0) { return Promise.resolve('dont-exists'); }
      return Promise.resolve(this.filterPosts(req[0]));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Get Post By Year Month
   *
   * @public
   *
   * @param {String|Number} year
   * @param {String|Number} month
   * @param {String} url
   *
   * @return {Promise<Object|String>}
   *
   */
  async getPostByYearMonth(year, month, url) {
    try {
      const req = await this.db.where({ url }).select('*').from('posts');
      if (req.length === 0) { return Promise.resolve('dont-exists'); }

      const post = req[0];
      const date = new Date(post.published);

      if (
        year === date.getFullYear().toString()
        && month === (date.getMonth() + 1).toString()
      ) { return Promise.resolve(this.filterPosts(req[0])); }

      return Promise.resolve('dont-exists');
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Get Post By Year Month Day
   *
   * @public
   *
   * @param {String|Number} year
   * @param {String|Number} month
   * @param {String|Number} day
   * @param {String} url
   *
   * @return {Promise<Object|String>}
   *
   */
  async getPostByYearMonthDay(year, month, day, url) {
    try {
      const req = await this.db.where({ url }).select('*').from('posts');

      if (req.length === 0) { return Promise.resolve('dont-exists'); }

      const post = req[0];
      const date = new Date(post.published);

      if (
        year === date.getFullYear().toString()
        && month === (date.getMonth() + 1).toString()
        && day === date.getDate().toString()
      ) { return Promise.resolve(this.filterPosts(req[0])); }

      return Promise.resolve('dont-exists');
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Get Post By ID
   *
   * @public
   *
   * @param {String} ID
   *
   * @return {Promise<Object|String>}
   *
   */
  async getPostByID(ID) {
    try {
      const req = await this.db.where({ ID }).select('*').from('posts');

      if (req.length === 0) { return Promise.resolve('dont-exists'); }
      return Promise.resolve(this.filterPosts(req[0]));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Filter Posts
   *
   * @private
   *
   * @param {Array} data
   * @param {Boolean} pagination
   * @param {String|Number} page
   *
   * @return {Object}
   */
  async filterPosts(data, pagination, page) {
    const urlID = await this.getUrlID();

    function parseEntry(e) {
      let { url, tags } = e;

      tags = tags.split(/,\s*/).filter((tag) => tag);

      if (e.postStatus !== 'published') { return { ...e, tags }; }

      if (urlID.toString() === '2') { url = `${e.category}/${e.url}`; }

      if (urlID.toString() === '3' || urlID.toString() === '4') {
        const date = new Date(e.published);

        if (urlID.toString() === '3') { url = `${date.getFullYear()}/${date.getMonth() + 1}/${e.url}`; }
        if (urlID.toString() === '4') { url = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${e.url}`; }
      }

      return {
        ...e,
        url,
        tags,
      };
    }

    if (!Array.isArray(data)) { return parseEntry(data); }

    let postData = {};
    let newData = data;

    if (pagination) {
      const postPage = page * 10;

      let next = false;
      let prev = false;

      if (data[postPage + 1]) { next = true; }

      if (postPage - 10 > 9) { prev = true; }

      newData = data.slice(postPage - 10, postPage);

      postData = {
        next,
        prev,
      };
    }

    postData.posts = newData.map((e) => parseEntry(e));

    if (!postData.posts) { postData.posts = []; }

    return postData;
  }

  /**
   * Get All Posts
   *
   * @description Returns an Object with all posts in DB
   * @public
   *
   * @param {Boolean} pagination
   * @param {String|Number} page
   *
   * @return {Promise<Object>}
   */
  async getAllPosts(pagination, page) {
    try {
      const req = await this.db.select('*').from('posts').orderBy('created', 'desc');

      return Promise.resolve(this.filterPosts(req, pagination, page));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Get Publish Posts
   *
   * @description Returns an Object with all published posts in DB
   * @public
   *
   * @param {Boolean} pagination
   * @param {String|Number} page
   *
   * @return {Promise<Object>}
   */
  async getPublishPosts(pagination, page) {
    try {
      const req = await this.db.where({ postStatus: 'published' }).select('*').from('posts').orderBy('published', 'desc');

      return Promise.resolve(this.filterPosts(req, pagination, page));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Get Draft Posts
   *
   * @description Returns an Object with all draft posts in DB
   * @public
   *
   * @param {Boolean} pagination
   * @param {String|Number} page
   *
   * @return {Promise<Object>}
   */
  async getDraftPosts(pagination, page) {
    try {
      const req = await this.db.where('postStatus', 'draft').select('*').from('posts').orderBy('published', 'desc');
      return Promise.resolve(this.filterPosts(req, pagination, page));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Search Post
   *
   * @description Returns an Object with all matched posts in DB
   * @public
   *
   * @param {String} query
   * @param {Boolean} pagination
   * @param {String|Number} page
   *
   * @return {Promise<Object>}
   */
  async searchPost(query, pagination, page) {
    try {
      const req = await this.db.where({ postStatus: 'published' }).select('*').from('posts').orderBy('published', 'desc');

      const posts = req.filter((e) => {
        let findInTags = false;
        const findInTitle = false;
        let findInContent = false;
        let findInCategory = false;

        if (e.category) {
          findInCategory = e.category.match(new RegExp(query, 'i')) !== null;
        }
        if (e.tags) {
          findInTags = e.tags.match(new RegExp(query, 'i')) !== null;
        }
        if (e.title) {
          findInContent = e.title.match(new RegExp(query, 'i')) !== null;
        }
        let data;
        if (e.content) {
          data = e.content.split('<').map((ev) => ev.replace(/.*>/, '')).join(' ');

          findInContent = data.match(new RegExp(query, 'i')) !== null;
        }

        if (findInContent || findInTitle || findInTags || findInCategory) { return true; }
        return false;
      });

      return posts.length === 0 ? Promise.resolve('dont-exists') : Promise.resolve(this.filterPosts(posts, pagination, page));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Set View
   *
   * @description Set a view on a single post
   * @public
   *
   * @param {String} url
   * @param {String} referer
   * @param {String} userAgent
   *
   * @return {Promise}
   */
  async setView(url, referer, userAgent, country) {
    try {
      const newUrl = !url ? '/' : url;

      const post = await this.db.where({ url: newUrl }).select('views').from('posts');

      if (newUrl === '/' || /search/.test(newUrl)) { return Promise.resolve(); }

      if (post.length === 0) { return Promise.resolve('dont-exists'); }

      await this.db('posts').where({ url: newUrl }).increment('views', 1);

      await this.db('views').insert({
        url: newUrl,
        referer,
        os: userAgent.os.name,
        browser: userAgent.browser.name,
        country,
        time: this.db.fn.now(),
      });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Set Comment
   *
   * @description Set a comment on a single post
   * @public
   *
   * @param {String} url
   *
   * @return {Promise}
   */
  async setComment(url) {
    try {
      await this.db('posts').where({ url }).increment('comments', 1);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Publish Post
   *
   * @description Publish a Posts into DB
   * @public
   *
   * @param {Object} data
   *
   * @return {Promise<Number>}
   *
   */
  async publishPost(data) {
    const now = this.db.fn.now();

    let postData = {};

    try {
      let id;
      if (data.ID === 'undefined' || data.ID === undefined) {
        postData = {
          ...data,
          comments: 0,
          updated: now,
          created: now,
          published: now,
          views: 0,
          postStatus: 'published',
        };

        delete postData.ID;
        const res = await this.db('posts').insert(postData, 'ID');

        [id] = res;
      } else {
        if (data.postStatus === 'draft') {
          postData = {
            ...data,
            updated: now,
            published: now,
            postStatus: 'published',
          };
        } else {
          postData = {
            ...data,
            updated: now,
            postStatus: 'published',
          };
        }

        await this.db('posts').where('ID', data.ID).update(postData);

        id = data.ID;
      }
      return Promise.resolve(id);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Save Post
   *
   * @description Save a Posts into DB
   * @public
   *
   * @param {Object} data
   *
   * @return {Promise<Number>}
   *
   */
  async savePost(data) {
    try {
      let id;
      let postData = {};
      if (data.ID === 'undefined') {
        postData = {
          ...data,
          comments: 0,
          created: this.db.fn.now(),
          views: 0,
          postStatus: 'draft',
        };
        delete postData.ID;
        const res = await this.db('posts').returning('ID').insert(postData);

        id = res;
      } else {
        postData = {
          ...data,
          postStatus: 'draft',
        };
        await this.db('posts').where('ID', data.ID).update(postData);

        id = data.ID;
      }
      return Promise.resolve(id);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async deletePost(ID, url) {
    try {
      await this.db('posts').where({ ID }).delete();
      await this.db('views').where({ url }).delete();

      return Promise.resolve({
        status: 'OK',
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getMostViewed() {
    try {
      const rows = await this.db('posts').select('*').where({ postStatus: 'published' }).orderBy("views", "desc");

      if (rows.length > 0) { return Promise.resolve(this.filterPosts(rows[0])); }
      return Promise.resolve({});
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getMostCommented() {
    try {
      const rows = await this.db('posts').select('*').where({ postStatus: 'published' }).orderBy("comments", "desc");

      if (rows.length > 0) { return Promise.resolve(this.filterPosts(rows[0])); }
      return Promise.reject();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = PostsDatabase;
