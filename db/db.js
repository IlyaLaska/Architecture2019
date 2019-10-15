'use strict';

const {Pool} = require('pg');

<<<<<<< HEAD
const myPool = {
  host: '127.0.0.1',
  port: '5432',
  database: 'Architecture',
  user: 'postgres',
  password: 'psd'
};

=======
>>>>>>> b7d621ffa7190b807584f890ef094b7a7f435699
class dbAccess {
  constructor() {}
  getInstance(details) {
    if(! dbAccess.instance) {
      dbAccess.instance = new Pool(details);
    }
    return dbAccess.instance;
  }
};

class db {
  constructor(pool) {
    this.pool = new dbAccess().getInstance(pool);
  }
  query(text, callback) {
    console.log(text);
    return this.pool.query(text, (err, res) => {
      if (err) {
        throw err;
      }
      // console.table(res.rows);
      return callback(res.rows);
    });
  }
  close() {
    return this.pool.end();
  }
  getTable(table, callback) {
    return this.query(`SELECT * from ${table}`, callback);
  }
  getTableByValue(table, field, value, callback) {
    let sign = '';
    if (value[0] === '>') {//sign in front
      sign = '>';
      value = value.slice(1);
      if (value[1] === '=') {
        sign += '=';
        value = value.slice(1);
      }
    } else if(value[0] === '<') {
      sign = '<';
      value = value.slice(1);
      if (value[1] === '=') {
        sign += '=';
        value = value.slice(1);
      }
    } else {
    sign = '=';      
    }
      return this.query(`SELECT * from ${table} WHERE "${field}" ${sign} '${value}'`, callback);
  }
  insertIntoTable(table, values, callback) {
    let myStr = '';
    let myProps = '';
    for (let prop in values) {
      myProps += '"' + prop + '"';
      myProps += ', ';
      myStr += "'" + values[prop] + "'";
      myStr += ', ';
    }
    myStr = myStr.slice(0, -2);
    myProps = myProps.slice(0, -2);
    return this.query(`INSERT INTO ${table} (${myProps}) values (${myStr})`, callback);
    // console.log(myProps);
  }
}

module.exports = db;
