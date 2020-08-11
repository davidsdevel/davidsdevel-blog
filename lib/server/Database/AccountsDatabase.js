const bcrypt = require('bcrypt');
const Database = require('./UsersDatabase');

class ColaboratorsDatabase extends Database {
  /**
     * Create Colaborator
     *
     * @param {Object<{ name: String, lastname: String, description: String, ocupation?: String, type: String, photo?: String, email: String, password: String, facebook?: String, twitter?: String, instagram?: String, linkedin?: String}>} data
     *
     * @return {Promise<String>}
     */
  async createColaborator(data) {
    try {
      const [ID] = await this.db('accounts').insert(data).returning('ID');

      return Promise.resolve(ID);
    } catch (err) {
      if (err.errno === 19) {
        return Promise.resolve("Email already exists");
      }
      return Promise.reject(err);
    }
  }

  /**
     * All Colaborators
     *
     * @description Get an Array with all colaborators
     * @public
     *
     * @returns {Promise<Object>}
     */
  async allColaborators() {
    try {
      const rows = await this.db
        .select('*')
        .from('accounts')
        .where({ type: 'colaborator' });

      return Promise.resolve({ colaborators: rows });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Login
   *
   * @public
   *
   * @param {String} email
   * @param {String} password
   *
   * @return {Promise<String|Object>}
   */
  async login(email, password) {
    try {
      const rows = await this.db.select('*').from('accounts').where({ email });

      if (rows.length === 0) { return Promise.resolve({ pass: false, message: 'Email no existe' }); }

      const pass = await bcrypt.compare(password, rows[0].password);

      if (pass) 
        return Promise.resolve({
          ...rows[0],
          password: undefined,
          pass: true
        });
      else
        return Promise.resolve({
          pass: false,
          message: 'Contraseña incorrecta'
        });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = ColaboratorsDatabase;
