'use strict'

const {dbSettings, serverSettings} = require('./config')

module.exports = Object.assign({}, {dbSettings, serverSettings})