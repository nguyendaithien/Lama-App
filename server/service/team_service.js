'use strict'

const mysql = require('mysql')

const logger = require('../logger')
const {to} = require('../helper/to')

class TeamService {
    constructor(mysql_db) {
        this.mysql_db = mysql_db
    }

    get_all_team() {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * FROM team
            `
            let [err, data] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[team_service][get_all_team] err: ${err}`)
                return reject(err.sqlMessage)
            }
            return resolve(data)
        })
    }

    get_team_info_by_id(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const check_team_query = `
                    SELECT COUNT(*) AS team_count FROM team WHERE id = ${mysql.escape(id)}
                `
                let teams_founded = await this.mysql_db.p_query(check_team_query)
                if (!teams_founded[0].team_count) {
                    return reject('team not found')
                }

                const get_team_query = `
                    SELECT id AS team_id, name AS team_name FROM team
                    WHERE id = ${mysql.escape(id)}
                `
                let team_data = (await this.mysql_db.p_query(get_team_query))[0]

                const get_user_team_query = `
                    SELECT user.id AS user_id, user.name, user.username, user.mail
                    FROM user JOIN team ON user.team_id = team.id 
                    WHERE team.id = ${mysql.escape(id)}
                `
                let user_team_data = (await this.mysql_db.p_query(get_user_team_query))

                team_data.data = user_team_data

                return resolve(team_data)
            } catch (err) {
                logger.error(`[team_service][get_team_info_by_id] err: ${err}`)
                return reject(err.sqlMessage)
            }
        })
    }

    get_team_info_by_name(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const check_team_query = `
                    SELECT COUNT(*) AS team_count FROM team WHERE name = ${mysql.escape(name)}
                `
                let teams_founded = await this.mysql_db.p_query(check_team_query)
                if (!teams_founded[0].team_count) {
                    return reject('team not found')
                }

                const get_team_query = `
                    SELECT id AS team_id, name AS team_name FROM team
                    WHERE name = ${mysql.escape(name)}
                `
                let team_data = (await this.mysql_db.p_query(get_team_query))[0]

                const get_user_team_query = `
                    SELECT user.id AS user_id, user.name, user.username, user.mail
                    FROM user JOIN team ON user.team_id = team.id 
                    WHERE team.name = ${mysql.escape(name)}
                `
                let user_team_data = (await this.mysql_db.p_query(get_user_team_query))

                team_data.data = user_team_data

                return resolve(team_data)
            } catch (err) {
                logger.error(`[team_service][get_team_info_by_name] err: ${err}`)
                return reject(err.sqlMessage)
            }
        })
    }

    add_user(user_id, team_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query_check_team = `
                    SELECT COUNT(*) AS count_team FROM team WHERE id = ${mysql.escape(team_id)}
                `
                const team_founded = await this.mysql_db.p_query(query_check_team)
                if (team_founded[0].count_team === 0) {
                    return reject('team not found')
                }

                const query = `
                    UPDATE user SET team_id = ${mysql.escape(team_id)}
                    WHERE user.id = ${mysql.escape(user_id)}
                `
                const res1 = await this.mysql_db.p_query(query)

                const query2 = `
                    SELECT id AS user_id, username, mail, name FROM user WHERE id = ${mysql.escape(user_id)}
                `
                const res2 = await this.mysql_db.p_query(query2)

                return resolve(Object.assign({}, res1, res2))
            } catch (err) {
                logger.error(`[team_service][add_user] err: ${err}`)
                return reject(err)
            }
        })
    }

    remove_user(user_id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                UPDATE user SET team_id = null
                WHERE user.id = ${mysql.escape(user_id)}
            `
            let [err, result] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[team_service][remove_user] err: ${err}`)
                return reject(err)
            }
            return resolve(result)
        })
    }

    create(team_name) {
        return new Promise(async (resolve, reject) => {
            const query = `
                INSERT INTO team(name) VALUES(${mysql.escape(team_name)})
            `
            const [err, res] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[team_service][create] err: ${err}`)
                return reject(err.sqlMessage)
            }
            return resolve(res.insertId)
        })
    }

    check_exist_user(username) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * FROM user
                WHERE user.username = ${mysql.escape(username)}
            `
            let [err, user_founded] = await to(this.mysql_db.p_query(query))
            if (err) {
                return reject(err)
            }
            const user_data = user_founded[0]
            if (!user_data) {
                return reject('user not found')
            }
            return resolve(user_data.id)
        })
    }

    check_user_in_team(username, team_id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * FROM user
                WHERE user.username = ${mysql.escape(username)}
            `
            let [err, user_founded] = await to(this.mysql_db.p_query(query))
            if (err) {
                return reject(err)
            }
            const user_data = user_founded[0]
            if (!user_data) {
                return reject('user not found')
            }
            if (!user_data.team_id || user_data.team_id !== team_id) {
                return reject('user not in team')
            }
            return resolve(user_data.id)
        })
    }
}

module.exports = TeamService
