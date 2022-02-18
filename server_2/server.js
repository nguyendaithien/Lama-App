'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const swagger_ui = require('swagger-ui-express')
// logging
const logger = require('./logger')

require('dotenv').config({path: path.join(__dirname, ".env")})

const app = express()

// const whitelist = ['*']
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allow by CORS'))
//         }
//     }
// }
// app.use(cors(corsOptions))

app.use(cors())

// app.use(morgan('dev'))
app.use(morgan('combined', {
    stream: logger.stream
}))

app.use(bodyParser.json())
app.use(helmet())

const backend_route = express.Router()

// use plural noun for resources(route)
// sử dụng số nhiều cho route
// ví dụ /users thay vì /user
const user_api = require('./api/routes/user_api')
const team_api = require('./api/routes/team_api')
const electronic_component_api = require('./api/routes/electronic_component_api')
const project_api = require('./api/routes/project_api')

backend_route.use('/users', user_api)
backend_route.use('/teams', team_api)
backend_route.use('/electronic-components', electronic_component_api)
backend_route.use('/projects', project_api)

const swagger_document = require('./swagger.json')
backend_route.use('/api-docs', swagger_ui.serve, swagger_ui.setup(swagger_document))

app.use('/backend', backend_route)

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} -${req.method} - ${req.ip}`)

    // render the error page
    res.status(err.status || 500)
    // res.render('error')
    res.send(err)
})

module.exports = app
