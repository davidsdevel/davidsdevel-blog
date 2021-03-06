const schedule = require('node-schedule');
const Database = require('./PostsDatabase');

/**
 * User Database
 *
 * @extends PostsDatabase
 */

class UsersDatabase extends Database {
  async addFCMToken(token, ID) {
    try {
      if (ID !== undefined && ID !== 'undefined') { await this.db('users').update({ fcmToken: token }).where({ ID }); } else { await this.db('users').insert({ fcmToken: token }); }

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createUser(name, lastname, email, feed, token) {
    try {
      const tokensRows = await this.db.select('fcmToken').from('users').where({ fcmToken: token });
      let ID;

      if (tokensRows.length === 0) {
        ID = await this.db('users').insert({
          name,
          lastname,
          email,
          feed,
          fcmToken: token,
        }, 'ID');
      } else {
        ID = await this.db('users').where({ fcmToken: token }).update({
          name,
          lastname,
          email,
          feed,
        }, 'ID');
      }

      // TODO: Send Mail
      const startTime = new Date(Date.now() + (1000 * 60 * 60 * 24));
      this.jobs[email] = schedule.scheduleJob(startTime, () => {
        this.removeUser(email);
      });

      return Promise.resolve({
        status: 'OK',
        success: true,
        ID,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async removeUser(email) {
    await this.db('users').where({ email }).delete();
  }

  /**
   * Cancel Remove Job
   *
   * param {String} email
   */
  cancelRemoveJob(email) {
    this.jobs[email].cancel();
  }

  /**
   * Verify User
   */
  async verifyUser(email, hash) {
    try {
      const isEqual = await bcrypt.compare(email, hash);

      if (isEqual) {
        this.cancelRemoveJob(email);

        await this.db.where({ email }).update({
          verified: true,
        });

        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Check
   *
   * @private
   *
   * @param {String} column
   * @param {Object} data
   *
   * @return {Promise<Object>}
   */
  async check(column, data) {
    try {
      const rows = await this.db.select(column).from('users').where(data);

      if (rows.length > 0) {
        return Promise.resolve({
          status: 'OK',
          exists: true,
        });
      }
      return Promise.resolve({
        status: 'OK',
        exists: false,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  checkUsername(name, lastname) {
    return this.check('name', { name, lastname });
  }

  checkEmail(email) {
    return this.check('email', { email });
  }
}

module.exports = UsersDatabase;
