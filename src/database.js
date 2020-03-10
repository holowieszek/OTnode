const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.host = '172.17.0.2';
    this.user = 'root';
    this.password = 'otnode';
    this.database = 'otnodedb';
  }

  connection() {
    const connection = 
       mysql.createPool({
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database
      });

    return connection;
  }

  async getAccount(account, password) {
    try {
      const [rows] = await this.connection().execute(`SELECT pl.nickname FROM accounts AS acc INNER JOIN players AS pl WHERE account = "${account}" AND password = "${password}" AND acc.id = pl.accountId`);
      return rows;
    } catch (error) {
      return error
    }
  }
}

module.exports = Database;