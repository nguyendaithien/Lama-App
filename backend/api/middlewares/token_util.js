const jwt = require('jsonwebtoken')

// if (process.env.NODE_ENV != 'production') {
//     require('dotenv').config()
// }

const verify_token = (req, res, next) => {
    const {authorization} = req.headers
    if (!authorization) {
        return res.status(403).json({
            auth: false,
            message: 'Token is required!!!'
        })
    }
    if (authorization.indexOf('Bearer ') !== 0) {
        return res.status(500).json({
            auth: false,
            message: 'Bearer token is required!!!'
        })
    }

    const token = authorization.replace('Bearer ', '')

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({auth: false, message: 'Failed to authenticate token.'})
        }
        // console.log(decoded)
        req.user_id = decoded.id
        next()
    })
}

module.exports = Object.assign({}, {verify_token})