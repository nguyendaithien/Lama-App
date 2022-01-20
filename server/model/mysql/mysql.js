// Built-in libraries
const util = require('util')

// Third-party libraries
const mysql = require('mysql')

// Local libraries
const {dbSettings} = require('../../config')

// https://codeburst.io/node-js-mysql-and-promises-4c3be599909b

class MysqlDB {
    constructor() {
        this.connection = mysql.createConnection({
            host: dbSettings.host,
            user: dbSettings.user,
            password: dbSettings.password,
            database: dbSettings.database,
        })

        this.pool = mysql.createPool({
            connectionLimit: 32,
            host: dbSettings.host,
            user: dbSettings.user,
            password: dbSettings.password,
            database: dbSettings.database,
        })
    }

    begin_transaction() {
        return util.promisify(this.connection.beginTransaction).call(this.connection)
    }

    // query of pool
    p_query(sql) {
        return util.promisify(this.pool.query).call(this.pool, sql)
    }

    query(sql) {
        return util.promisify(this.connection.query).call(this.connection, sql)
    }

    commit() {
        return util.promisify(this.connection.commit).call(this.connection)
    }

    rollback() {
        return util.promisify(this.connection.rollback).call(this.connection)
    }

    close() {
        return util.promisify(this.connection.end).call(this.connection)
    }
}


// Ping database to check for common exception errors.
//pool.getConnection((err, connection) => {
//    if (err) {
//        console.log(`Connection to db error`)
//        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//            console.error('Database connection was closed.')
//        } else if (err.code === 'ER_CON_COUNT_ERROR') {
//            console.error('Database has too many connections.')
//        } else if (err.code === 'ECONNREFUSED') {
//            console.error('Database connection was refused.')
//        } else {
//            console.error(err)
//        }
//    }
//
//
//    if (connection) {
//        console.log(`Connected to mysql server at ${dbSettings.host}`)
//        connection.release()
//    }
//
//    return
//})


module.exports = MysqlDB
