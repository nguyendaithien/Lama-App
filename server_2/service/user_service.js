'use strict'

const logger = require('../logger')
const bcrypt = require('bcryptjs')
const mysql = require('mysql')
const MysqlDB = require('../model/mysql/mysql')
const {to} = require('../helper/to')

class UserService {
    constructor(mysql_db) {
        // mysql_db is instance of MysqlDB
        // init by command mysql_db = new MysqlDB()
        this.mysql_db = mysql_db
    }

    get_user_infor(req) {
        return new Promise(async (resolve, reject) => {
            const user_id = req.user_id
            const query = `SELECT username, name, mail, avatar FROM user WHERE id = ${mysql.escape(user_id)}`
            const [err, user] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[user_service][get_user_infor] err: ${err}`)
                return reject(err)
            }
            resolve(user)
        })
    }

    // check if email or username is available
    is_registered_user(mail, username) {
        return new Promise(async (resolve, reject) => {
            try {
                let query1 = `
                    SELECT * FROM user
                    WHERE mail = ${mysql.escape(mail)}
                    LIMIT 1
                `
                const user1 = await this.mysql_db.p_query(query1)

                let query2 = `
                    SELECT * FROM user
                    WHERE username = ${mysql.escape(username)}
                    LIMIT 1
                `
                const user2 = await this.mysql_db.p_query(query2)

                if (user1.length === 1 && user2.length === 1) {
                    return reject(`username and email already exist`)
                } else if (user1.length === 1) {
                    return reject(`email already exists`)
                } else if (user2.length === 1) {
                    return reject(`username already exists`)
                } else {
                    return resolve()
                }

            } catch (err) {
                logger.error(`[user_service][check_email_and_username] err: ${err}`)
                reject(err)
            }
        })
    }

    register(user) {
        return new Promise(async (resolve, reject) => {
            const query = `
                INSERT INTO user(mail, username, name, password) 
                VALUES('${user.mail}', '${user.username}', '${user.name}', '${user.password}')
            `
            const [err, result] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[user_service][sign_up] err: ${err}`)
                return reject(err)
            }
            return resolve(result)
        })
    }

    login(user) {
        return new Promise(async (resolve, reject) => {
            let username = user.username
            let query = `
                SELECT * FROM user 
                WHERE username = ${mysql.escape(username)} 
                OR mail = ${mysql.escape(username)}
                LIMIT 1 
            `
            let [err, user_found_array] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[user_service][login] err: ${err}`)
                return reject(err)
            }

            if (user_found_array.length !== 0) {
                let user_found = user_found_array[0]
                if (bcrypt.compareSync(user.password, user_found.password)) {
                    resolve(user_found)
                } else {
                    reject('wrong password')
                }
            } else {
                reject('email or username are not found')
            }
        })
    }


    get_user_by_mail(mail) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT username, avatar FROM user WHERE mail = ${mysql.escape(mail)}`
                const user = await this.mysql_db.p_query(query)
                resolve(user)
            } catch (err) {
                logger.error(`Getting lasted post failed \n ${err}`)
                if (!err.sqlMessage) {
                    reject('There is error in getting latest post. Contact admin for detail.')
                }
                reject(err.sqlMessage)
            }
        })
    }

    get_role_by_user_id(user_id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT r.title as role 
                FROM user_role as ur 
                JOIN role as r
                ON r.id = ur.role_id
                WHERE ur.user_id = ${mysql.escape(user_id)}
            `
            const [err, result] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[user_service][get_role_by_user_id] err: ${err}`)
                return reject(err)
            }
            resolve(result[0].role)
        })

    }

    //  Todo test if insert non-exists userId and roleId successfully
    set_role(user_id, role_id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                INSERT INTO user_role(user_id, role_id)
                VALUES (${mysql.escape(user_id)}, ${mysql.escape(role_id)})
            `
            let [err, result] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[user_service][set_role] err: ${err}`)
                return reject(err)
            }
            resolve(result)
        })
    }

    /**
     *  Test case:
     * Update with non-existed user or role
     * If user has 2 role, update one role to the same with other role
     *
     */
    update_role(user_id, role_id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                UPDATE user_role
                SET role_id = ${mysql.escape(role_id)}
                WHERE user_id = ${mysql.escape(user_id)}
            `

            let [err, result] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[user_service][update_role] err: ${err}`)
                return reject(err)
            }
            if (result.affectedRows === 0) {
                return reject(`user_id does not exists`)
            }
            return resolve(result)
        })
    }
}

module.exports = UserService
