const Database = require('./UsersDatabase');
const bcrypt = require("bcrypt");

class ColaboratorsDatabase extends Database {
  /**
     * Create Colaborator
     *
     * @param {Object} data
     *
     * @return {Promise<String>}
     */
  async createColaborator(data) {
    try {
      const ID = await this.db('accounts').insert(data).returning('ID');
    } catch (err) {
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
      const rows = this.db
        .select('ID', 'name', 'lastName', 'photo', 'ocupation')
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
      const rows = await this.db.select("*").from("accounts").where({email});

      if (rows.length === 0) {return Promise.resolve({pass: false, message: "Email no existe"})}

      const pass = await bcrypt.compare(password, rows[0].password);

      return Promise.resolve({...rows[0], pass, message: !pass ? "Contraseña Incorrecta" : "" });
    } catch(err) {
      return Promise.reject(err);
    }
  }
}

module.exports = ColaboratorsDatabase;
