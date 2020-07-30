const bcrypt = require('bcrypt');
const Knex = require('knex');
const Database = require('./AccountsDatabase');

const saltRounds = 10;

class DB extends Database {
  /**
   * Init
   *
   * @public
   *
   * @param {String} name
   * @param {String} lastname
   * @param {String} email
   * @param {String} password
   *
   * @return {Promise}
   */
  async init(name, lastname, email, password) {
    try {
      const existsBlog = await this.db.schema.hasTable('blog');
      const existsPosts = await this.db.schema.hasTable('posts');
      const existsUsers = await this.db.schema.hasTable('users');
      const existsViews = await this.db.schema.hasTable('views');
      const existsFiles = await this.db.schema.hasTable('files');
      const existsAccounts = await this.db.schema.hasTable('accounts');

      if (!existsBlog) {
        await this.db.schema.createTable('blog', (table) => {
          table.string('key').unique();
          table.text('value');
        });

        await this.db('blog').insert({ key: 'url', value: '1' });
        await this.db('blog').insert({ key: 'categories', value: '[{"name": "example", "alias": "Ejemplo"}]' });
        await this.db('blog').insert({ key: 'title', value: 'Blog de ejemplo' });
        await this.db('blog').insert({ key: 'description', value: 'Mi super descripción del blog' });

        // Change on Production
        await this.db('blog').insert({ key: 'installed', value: 'true' });
      }

      if (!existsPosts) {
        await this.db.schema.createTable('posts', (table) => {
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
          table.integer('authorID');
          table.string('postStatus');
          table.string('image');
          table.string('url');
          table.integer('views').defaultTo(0);
        });
      }

      if (!existsUsers) {
        await this.db.schema.createTable('users', (table) => {
          table.increments('ID');
          table.string('name');
          table.string('lastname');
          table.string('email').unique();
          table.string('feed');
          table.string('fcmToken');
          table.boolean('verified').defaultTo(false);
        });
      }

      if (!existsViews) {
        await this.db.schema.createTable('views', (table) => {
          table.string('url');
          table.string('referer');
          table.string('os');
          table.string('browser');
          table.string('country');
          table.dateTime('time');
        });
      }

      if (!existsFiles) {
        await this.db.schema.createTable('files', (table) => {
          table.string('name');
          table.string('type');
          table.string('secret');
          table.string('mime');
          table.string('width', 4);

          if (this.client === 'mysql') { table.specificType('buffer', 'mediumblob'); } else { table.binary('buffer'); }
        });
      }

      if (!existsAccounts) {
        await this.db.schema.createTable('accounts', (table) => {
          table.increments('ID');
          table.string('name').notNullable();
          table.string('lastName').notNullable();
          table.text('description');
          table.string('ocupation');
          table.string('type');
          table.string('photo');
          table.string('email').unique();
          table.string('password');
          table.string('facebook');
          table.string('twitter');
          table.string('instagram');
          table.string('linkedin');
        });

        const hash = await bcrypt.hash(password, saltRounds);
        await this.db('accounts').insert({
          name,
          lastname,
          password: hash,
          email,
        });
      }

      console.log('Installed');
      return Promise.resolve();
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
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
      const rows = await this.db.select('value').from('blog');// .where({key: "installed"});
      console.log(rows);

      return Promise.resolve(rows[0].value === 'true');
    } catch (err) {
      return Promise.reject(err);
    }
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

    if (client === 'pg') {
      protocol = !!password ? `postgres://${user}:${password}@${server}:${port}/${database}` : user;
    } else if (client === 'mysql') {
      protocol = {
        user,
        password,
        server,
        port,
        database,
      };
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
  static async testConnection(client, user, password, server, port, database) {
    try {
      let protocol;

      if (client === 'pg') { protocol = `postgres://${user}:${password}@${server}:${port}/${database}`; } else if (client === 'mysql') {
        protocol = {
          user,
          password,
          server,
          port,
          database,
        };
      } else {
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
      return Promise.reject();
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
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = DB;
