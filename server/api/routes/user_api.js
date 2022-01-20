'use strict'

const express = require('express')
const user_api = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {verify_token, check_required_field} = require('../middlewares')
const MysqlDB = require('../../model/mysql/mysql')
const UserService = require('../../service/user_service')

const mysql_db = new MysqlDB()
const user_service = new UserService(mysql_db)

user_api.post('/register',
    check_required_field(['mail', 'username', 'password', 'name']),
    async (req, res, next) => {
        try {
            await user_service.is_registered_user(req.body.mail, req.body.username)
        } catch (err_msg) {
            return res.status(500).json({message: err_msg})
        }

        const hashed_password = bcrypt.hashSync(req.body.password, 8)
        const new_user = {
            name: req.body.name,
            username: req.body.username,
            mail: req.body.mail,
            password: hashed_password,
            avatar: null
        }

        if (!process.env.SECRET) {
            return res.status(500).json({message: 'register failed - secret key not found'})
        }
        user_service
            .register(new_user)
            .then(result => {
                if (result.affectedRows === 1) {
                    const access_token = jwt.sign(
                        {
                            id: result.insertId
                        },
                        process.env.SECRET,
                        {
                            expiresIn: 86400
                        }
                    )
                    return res.status(200).json({
                        message: 'User is created successfully',
                        username: new_user.username,
                        avatar: new_user.avatar || null,
                        'access-token': access_token
                    })
                } else {
                    return res.status(500).json({
                        message: 'user is not created successfully'
                    })
                }
            })
            .catch(err_msg => {
                return res.status(501).json({
                    message: `server error , ${err_msg}`
                })
            })
    })

user_api.post('/login',
    check_required_field(['username', 'password']),
    (req, res, next) => {
        const user_credential = {
            username: req.body.username,
            password: req.body.password
        }

        if (!process.env.SECRET) {
            return res.status(500).json({message: 'login failed - secret key not found'})
        }
        user_service
            .login(user_credential)
            .then(user => {
                const access_token = jwt.sign(
                    {
                        id: user.id
                    },
                    process.env.SECRET,
                    {
                        expiresIn: 86400
                    }
                )
                res.status(200).json({
                    message: 'login successfully',
                    username: user.username,
                    avatar: user.avatar || null,
                    'access-token': access_token
                })
            })
            .catch(err_msg => {
                return res.status(500).json({
                    message: err_msg
                })
            })
    })

user_api.get('/information', verify_token, async (req, res, next) => {
    user_service
        .get_user_infor(req)
        .then(user => {
            return res.status(200).json(user)
        }).catch(err_msg => {
            return res.status(500).json({
                message: err_msg
            })
        })
})

// user_api.get('/get-role', verify_token, async (req, res) => {
//     user_service.get_role_by_user_id(req.userId).then((role) => {
//         return res.status(200).json({role: role})
//     }).catch((errMsg) => {
//         res.status(500).json({
//             mssage: errMsg
//         })
//     })
// })

// user_api.post('/admin/set-role', verify_token, async (req, res, next) => {
//     const {userId, roleId} = req.body
//     if (!user || !roleId) {
//         logger.info(`userId and roleId are both required`)
//         return res.status(500).json({
//             message: `userId and roleId are both required`
//         })
//     }
//
//     user_service
//         .set_role(userId, roleId)
//         .then(result => {
//             return res.status(200).json({
//                 message: 'Set role successfully'
//             })
//         })
//         .catch(errMsg => {
//             return res.status(500).json({
//                 message: errMsg
//             })
//         })
// })

module.exports = user_api
