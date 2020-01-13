'use strict';

const {Pool} = require('pg');

class dbAccess {
  constructor() {
    this.connections = {}
  }
  getInstance(details) {
    // console.log(details, this.connections);
    if(! this.connections[details.database]) {
      this.connections[details.database] = new Pool(details);
    }
    return this.connections[details.database];
  }
};
const connectionsPool = new dbAccess();

class db {
  constructor(pool) {
    this.pool = connectionsPool.getInstance(pool);
  }
  query(text, callback) {
    // console.log(text);
    // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    // console.log(typeof text);
    // console.log(typeof callback);
    // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    return this.pool.query(text, (err, res) => {
      if (err) {
        throw err;
      }
      if (callback) return callback(res.rows);
      else return res.rows;
    });
  }
  close() {
    return this.pool.end();
  }
  getTable(table, callback) {
    // console.log(this.pool);
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
  insertIntoTable(table, values, callback) {//expect values as {colName: Value, ...}
    let myStr = '';
    let myProps = '';
    for (let prop in values) {
      myProps += '"' + prop + '"';
      myProps += ', ';
      
      if((`${values[prop]}`.slice(0,7)).toLowerCase() === '(select') {
        myStr += values[prop];
      }
      else myStr += "'" + values[prop] + "'";
      
      myStr += ', ';
    }
    myStr = myStr.slice(0, -2);
    myProps = myProps.slice(0, -2);
    return this.query(`INSERT INTO ${table} (${myProps}) values (${myStr})`, callback);
    // console.log(myProps);
  }
}

module.exports = db;
