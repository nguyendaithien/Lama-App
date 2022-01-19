'use strict'

const env = process.env.NODE_ENV || 'development' // dev or prod
const util = require('util')

const development = {
    dbSettings: {
        host: 'localhost',
        user: 'duyle',
        password: 'duyle95',
        database: 'project_management',

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    serverSettings: {
        port: process.env.PORT || 4000
    }
}

const production = {
    dbSettings: {
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        database: process.env.SQL_DBNAME,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    serverSettings: {
        port: process.env.PORT
    }
}

const config = {
    development,
    production
}

module.exports = Object.assign({}, config[env])