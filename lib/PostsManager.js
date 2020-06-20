class PostsManager {
  constructor(db) {
    this.db = db;
  }

  async all(page) {
    try {
      let posts;
      if (page) { posts = await this.db.getPublishPosts(true, page); }
      else { posts = await this.db.getPublishPosts(true, 1); }

      return Promise.resolve(posts);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async single(ID) {
    try {
      const req = await this.db.getPostByID(ID);

      if (req.postStatus !== 'published') { return Promise.reject({ status: 'dont-exists' }); }

      return Promise.resolve(req);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async allEdit() {
    try {
      const posts = await this.db.getAllPosts();

      return Promise.resolve(posts);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async singleEdit(ID) {
    try {
      const req = await this.db.getPostByID(ID);

      req.isPublished = req.published !== null;

      return Promise.resolve(req);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async setView(url, referer, userAgent) {
    try {
      await this.db.setView(url, referer, userAgent);

      return Promise.resolve();
    } catch (err) {
      Promise.reject(err);
    }
  }

  async search(query, page) {
    try {
      const req = await this.db.searchPost(query, page);

      return Promise.resolve(req);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
module.exports = PostsManager;
