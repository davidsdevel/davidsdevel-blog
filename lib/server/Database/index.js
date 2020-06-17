// const bcrypt = require("bcrypt");
const Knex = require('knex');
const Database = require('./UsersDatabase');

class DB extends Database {
  /**
   * Init
   *
   * @public
   *
   * @return {Promise}
   */
  async init(title, description) {
    try {
      const promisesArray = [];

      const existsBlog = await this.db.schema.hasTable('blog');
      const existsPosts = await this.db.schema.hasTable('posts');
      const existsUsers = await this.db.schema.hasTable('users');
      const existsViews = await this.db.schema.hasTable('views');
      const existsFiles = await this.db.schema.hasTable('files');
      const existsColaborators = await this.db.schema.hasTable('colaborators');

      if (!existsBlog) {
        promisesArray.push(this.db.schema.createTable('blog', (table) => {
          table.string('key').unique();
          table.text('value');
        }));

        promisesArray.push(this.db('blog').insert({ key: 'url', value: '1' }));
        promisesArray.push(this.db('blog').insert({ key: 'categories', value: '[]' }));
        promisesArray.push(this.db('blog').insert({ key: 'title', value: title }));
        promisesArray.push(this.db('blog').insert({ key: 'description', value: 'description' }));

        //Change on Production
        promisesArray.push(this.db('blog').insert({ key: 'installed', value: 'true' }));
      }

      if (!existsPosts) {
        promisesArray.push(this.db.schema.createTable('posts', (table) => {
          table.increments('ID');
          table.string('title');
          table.text('description');
          table.text('tags');
          table.string('category');
          table.text('content');
          table.integer('comments').defaultTo(0);
          table.dateTime('created');
          table.dateTime('published');
          table.dateTime('updated');
          table.string('postStatus');
          table.string('image');
          table.string('url');
          table.integer('views').defaultTo(0);
        }));
      }

      if (!existsUsers) {
        promisesArray.push(this.db.schema.createTable('users', (table) => {
          table.increments('ID');
          table.string('name');
          table.string('lastname');
          table.string('email').unique();
          table.string('feed');
          table.string('fcmToken');
          table.boolean('verified').defaultTo(false);
        }));
      }

      if (!existsViews) {
        promisesArray.push(this.db.schema.createTable('views', (table) => {
          table.string('url');
          table.string('referer');
          table.string('os');
          table.string('browser');
          table.string('country');
          table.dateTime('time');
        }));
      }

      if (!existsFiles) {
        promisesArray.push(this.db.schema.createTable('files', (table) => {
          table.string('name');
          table.string('type');
          table.string('secret');
          table.string('mime');
          table.string('width', 4);

          if (this.client === 'mysql') { table.specificType('buffer', 'mediumblob'); } else { table.binary('buffer'); }
        }));
      }

      if (!existsColaborators) {
        promisesArray.push(this.db.schema.createTable('colaborators', (table) => {
          table.increments('ID');
          table.string('name').notNullable();
          table.string('lastName').notNullable();
          table.text('description').notNullable();
          table.string('ocupation').notNullable();
          table.string('type').notNullable();
          table.string('photo');
          table.string('email').unique();
          table.string('password');
          table.string('facebook');
          table.string('twitter');
          table.string('instagram');
          table.string('linkedin');
        }));
      }

      return Promise.all(promisesArray);
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }
  /**
   * Is Installed
   * 
   * @description Return Database Status
   * @public
   * 
   * @return {Promise<Boolean>}
   */
  isInstalled() {
    return Promise.resolve(true);
  }

  /**
   * Connect
   *
   * @description Connect with Database
   * @public
   *
   * @param {String} client
   * @param {String} user
   * @param {String} password
   * @param {String} server
   * @param {String} port
   * @param {String} database
   *
   * @return {void}
   */
  connect(client, user, password, server, port, database) {
    let protocol;

    if (client === 'pg') { protocol = `postgres://${user}:${password}@${server}:${port}/${database}`; }
    else if (client === 'mysql') {
      protocol = {
        user,
        password,
        server,
        port,
        database
      }
    } else {
      protocol = {
        filename: './data.db',
      };
    }

    this.db = Knex({
      client,
      connection: protocol,
    });
    this.client = client;
  }

  /**
   * Test Connection
   *
   * @description Test connection with database
   * @public
   *
   * @param {String} client
   * @param {String} user
   * @param {String} password
   * @param {String} server
   * @param {String} port
   * @param {String} database
   *
   * @return {Promise<Boolean>}
   */
  async testConnection(client, user, password, server, port, database) {
    try {
      let protocol;

      if (client === 'pg') { protocol = `postgres://${user}:${password}@${server}:${port}/${database}`; }
      else if (client === 'mysql') {
        protocol = {
          user,
          password,
          server,
          port,
          database
        }
      }
      else {
        protocol = {
          filename: './data.db',
        };
      }

      const connection = Knex({
        client,
        connection: protocol,
      });

      await connection.schema.createTable('test', (table) => {
        table.string('key');
      });

      await connection.schema.dropTable('test');

      await connection.destroy();

      return Promise.resolve(true);
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Destroy
   * 
   * @description Destroy Database Connection
   * @public
   * 
   * @return {Promise<void>}
   */
  async destroy() {
    try {
      this.db.destroy();

      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }
}

module.exports = DB;
