class Database {
  /**
   * Code
   *
   * @description Return global code to Database
   * @static
   *
   * @private
   *
   * @return {Number}
   */
  static get code() {
    return 1;
  }

  /**
   * Success
   *
   * @description Static method to handle a successfull response
   * @param {String} message
   * @param {any?} data
   *
   * @return {Object}
   */
  static success(message, data) {
    return {
      CODE: this.code,
      STATUS: 1,
      DATA_STATUS: data ? 1 : 2,
      MESSAGE: message,
      data,
    };
  }

  /**
   * Error
   *
   * @description Static method to handle a successfull response
   * @param {String} message
   *
   * @return {Object}
   */
  static error(message) {
    return {
      CODE: this.code,
      STATUS: 2,
      DATA_STATUS: 2,
      MESSAGE: message,
    };
  }
}

const contstans = {
  database: Database,
};

module.exports = contstans;
