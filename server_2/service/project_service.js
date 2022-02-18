'use strict'

const mysql = require('mysql')

const {to} = require('../helper/to')
const logger = require('../logger')

class ProjectService {
    constructor(mysql_db) {
        this.mysql_db = mysql_db
    }

    check_exist_project(id, title) {
        return new Promise(async (resolve, reject) => {
            let query
            if (id) {
                query = `SELECT COUNT(*) AS project_count FROM project WHERE id = ${mysql.escape(id)}`
                const [err, res] = await to(this.mysql_db.p_query(query))
                if (err) {
                    logger.error(`[project_service][check_exist_project] err: ${err}`)
                    return reject(err.sqlMessage)
                }
                if (res[0].project_count) {
                    return resolve(id)
                } else {
                    return reject('project not found')
                }
            } else {
                query = `SELECT COUNT(*) AS project_count FROM project WHERE title = ${mysql.escape(title)}`
                const [err, res] = await to(this.mysql_db.p_query(query))
                if (err) {
                    logger.error(`[project_service][check_exist_project] err: ${err}`)
                    return reject(err.sqlMessage)
                }
                if (res[0].project_count) {
                    return resolve(title)
                } else {
                    return reject('project not found')
                }
            }
        })
    }

    find_all() {
        return new Promise(async (resolve, reject) => {
            try {
                const query1 = `
                    SELECT p.id, p.title, p.description, p.income, 
                    p.expected_start_time, p.expected_finish_time, p.real_start_time, p.real_finish_time, p.note, p.created_at,
                    (q1.pay_cost + q2.other_cost) AS total_cost 
                    FROM project AS p
                    JOIN
                    (SELECT p.id AS project_id, SUM(pay.value) AS pay_cost
                    FROM cost AS c
                    JOIN project AS p ON c.project_id = p.id
                    JOIN pay ON c.id = pay.cost_id
                    GROUP BY p.id) AS q1
                    ON p.id = q1.project_id
                    JOIN
                    (SELECT p.id AS project_id, (c.server + c.cost_incurred) AS other_cost
                    FROM cost AS c
                    JOIN project AS p ON p.id = c.project_id) AS q2
                    ON p.id = q2.project_id
                `
                const res1 = await this.mysql_db.p_query(query1)

                const query2 = `
                    SELECT p.id AS project_id, SUM(ec.price * ec.amount) AS ec_cost
                    FROM electronic_component AS ec
                    JOIN project AS p ON ec.project_id = p.id
                    GROUP BY p.id;
                `
                const res2 = await this.mysql_db.p_query(query2)

                res1.forEach(data1 => {
                    let ec_cost = res2.filter(data2 => data2.project_id === data1.id)[0]?.ec_cost
                    if (ec_cost) {
                        data1.total_cost += ec_cost
                    }
                })
                return resolve(res1)
            } catch (err) {
                logger.error(`[project_service][find_all] err: ${err}`)
                return reject(err.sqlMessage)
            }
        })
    }

    find_by_id(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query1 = `
                    SELECT p.id, p.title, p.description, p.income, 
                    p.expected_start_time, p.expected_finish_time, p.real_start_time, p.real_finish_time, p.note, p.created_at,
                    q1.server_cost, q1.incurred_cost, (q1.pay_cost + q2.other_cost) AS total_cost 
                    FROM project AS p
                    JOIN
                    (SELECT p.id AS project_id, c.server AS server_cost, c.cost_incurred AS incurred_cost, SUM(pay.value) AS pay_cost
                    FROM cost AS c
                    JOIN project AS p ON c.project_id = p.id
                    JOIN pay ON c.id = pay.cost_id
                    GROUP BY p.id) AS q1
                    ON p.id = q1.project_id
                    JOIN
                    (SELECT p.id AS project_id, (c.server + c.cost_incurred) AS other_cost
                    FROM cost AS c
                    JOIN project AS p ON p.id = c.project_id) AS q2
                    ON p.id = q2.project_id
                    WHERE p.id = ${mysql.escape(id)}
                `
                const res1 = await this.mysql_db.p_query(query1)

                const query2 = `
                    SELECT p.id AS project_id, SUM(ec.price * ec.amount) AS ec_cost
                    FROM electronic_component AS ec
                    JOIN project AS p ON ec.project_id = p.id
                    WHERE p.id = ${mysql.escape(id)}
                    GROUP BY p.id
                `
                const res2 = await this.mysql_db.p_query(query2)

                let ec_cost = res2[0]?.ec_cost
                if (ec_cost) {
                    res1[0].total_cost += ec_cost
                }

                const query3 = `
                    SELECT DISTINCT u.username, pay.value AS pay
                    FROM user_project AS up
                    JOIN user AS u ON up.user_id = u.id
                    JOIN pay ON up.user_id= pay.user_id
                    JOIN cost AS c ON pay.cost_id = c.id
                    WHERE c.project_id = ${mysql.escape(id)};
                `
                const res3 = await this.mysql_db.p_query(query3)
                res1[0].member = res3

                let last_res = {}
                Object.assign(last_res, res1[0])
                delete last_res.server_cost
                delete last_res.incurred_cost
                last_res.cost = {server_cost: res1[0].server_cost, incurred_cost: res1[0].incurred_cost}

                return resolve(last_res)
            } catch (err) {
                logger.error(`[project_service][find_by_id] err: ${err}`)
                return reject(err.sqlMessage)
            }
        })
    }

    find_by_title(title) {
        return new Promise(async (resolve, reject) => {
            try {
                const query1 = `
                    SELECT p.id, p.title, p.description, p.income, 
                    p.expected_start_time, p.expected_finish_time, p.real_start_time, p.real_finish_time, p.note, p.created_at,
                    q1.server_cost, q1.incurred_cost, (q1.pay_cost + q2.other_cost) AS total_cost 
                    FROM project AS p
                    JOIN
                    (SELECT p.id AS project_id, c.server AS server_cost, c.cost_incurred AS incurred_cost, SUM(pay.value) AS pay_cost
                    FROM cost AS c
                    JOIN project AS p ON c.project_id = p.id
                    JOIN pay ON c.id = pay.cost_id
                    GROUP BY p.id) AS q1
                    ON p.id = q1.project_id
                    JOIN
                    (SELECT p.id AS project_id, (c.server + c.cost_incurred) AS other_cost
                    FROM cost AS c
                    JOIN project AS p ON p.id = c.project_id) AS q2
                    ON p.id = q2.project_id
                    WHERE p.title = ${mysql.escape(title)}
                `
                const res1 = await this.mysql_db.p_query(query1)

                const query2 = `
                    SELECT p.id AS project_id, SUM(ec.price * ec.amount) AS ec_cost
                    FROM electronic_component AS ec
                    JOIN project AS p ON ec.project_id = p.id
                    WHERE p.title = ${mysql.escape(title)}
                    GROUP BY p.id
                `
                const res2 = await this.mysql_db.p_query(query2)

                let ec_cost = res2[0]?.ec_cost
                if (ec_cost) {
                    res1[0].total_cost += ec_cost
                }

                const query3 = `
                    SELECT DISTINCT u.username, pay.value
                    FROM user_project AS up
                    JOIN user AS u ON up.user_id = u.id
                    JOIN pay ON up.user_id= pay.user_id
                    JOIN cost AS c ON pay.cost_id = c.id
                    JOIN project AS p ON c.project_id = p.id
                    WHERE p.title = ${mysql.escape(title)};
                `
                const res3 = await this.mysql_db.p_query(query3)
                res1[0].member = res3

                let last_res = {}
                Object.assign(last_res, res1[0])
                delete last_res.server_cost
                delete last_res.incurred_cost
                last_res.cost = {server_cost: res1[0].server_cost, incurred_cost: res1[0].incurred_cost}

                return resolve(last_res)
            } catch (err) {
                logger.error(`[project_service][find_by_title] err: ${err}`)
                return reject(err.sqlMessage)
            }
        })
    }

    check_exist_user(username, mysql_db) {
        return new Promise(async (resolve, reject) => {
            const query = `SELECT id FROM user WHERE username = ${mysql.escape(username)}`
            const [err, res] = await to(mysql_db.query(query))
            if (err) {
                logger.error(`[project_service][check_exist_user] err: ${err}`)
                return reject(err.sqlMessage)
            }
            if (!res.length) {
                return reject(`user ${username} not found`)
            }
            return resolve(res[0].id)
        })
    }

    create(project) {
        return new Promise(async (resolve, reject) => {
            let {
                title,
                description,
                income,
                expected_start_time,
                expected_finish_time,
                real_start_time,
                real_finish_time,
                note,
                member,
                cost
            } = project
            income = income ? income : 0
            cost.server = cost.server ? cost.server : 0
            cost.cost_incurred = cost.cost_incurred ? cost.cost_incurred : 0
            let total_cost = cost.server + cost.cost_incurred

            try {
                await this.mysql_db.begin_transaction()

                const query1 = `
                    INSERT INTO project(title, description, income,
                    expected_start_time, expected_finish_time, real_start_time, real_finish_time, note)
                    VALUES(
                    ${mysql.escape(title)},
                    ${mysql.escape(description)},
                    ${mysql.escape(income)},
                    ${mysql.escape(expected_start_time)},
                    ${mysql.escape(expected_finish_time)},
                    ${mysql.escape(real_start_time)},
                    ${mysql.escape(real_finish_time)},
                    ${mysql.escape(note)}
                )`
                const res1 = await this.mysql_db.query(query1)
                const project_id = res1.insertId

                const query2 = `
                    INSERT INTO cost(project_id, server, cost_incurred)
                    VALUES(
                    ${mysql.escape(project_id)}, 
                    ${mysql.escape(cost.server)}, 
                    ${mysql.escape(cost.cost_incurred)}
                )`
                const res2 = await this.mysql_db.query(query2)
                const cost_id = res2.insertId

                for (let i = 0; i < member.length; i++) {
                    let user_id = await this.check_exist_user(member[i].username, this.mysql_db)

                    let query3 = `
                        INSERT INTO user_project(user_id, project_id)
                        VALUES(${mysql.escape(user_id)}, ${mysql.escape(project_id)})
                    `
                    await this.mysql_db.query(query3)

                    let query4 = `
                        INSERT INTO pay(cost_id, user_id, value)
                        VALUES(
                        ${mysql.escape(cost_id)},
                        ${mysql.escape(user_id)},
                        ${mysql.escape(member[i].pay)}
                    )`
                    await this.mysql_db.query(query4)
                    total_cost += member[i].pay
                }
                const res5 = await this.mysql_db.query(`SELECT created_at FROM project WHERE id = ${mysql.escape(project_id)}`)
                const created_at_time = res5[0].created_at

                await this.mysql_db.commit()
                project.id = project_id
                project.total_cost = total_cost
                project.created_at = created_at_time

                return resolve(project)
            } catch (err) {
                logger.error(`[project_service][create] err: ${err}`)
                await this.mysql_db.rollback()
                return reject(err.sqlMessage || err)
            }
        })
    }

    delete(project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.mysql_db.begin_transaction()

                const query1 = `
                    SELECT c.id as cost_id FROM cost AS c JOIN project AS p 
                    ON c.project_id = p.id WHERE p.id = ${mysql.escape(project_id)}
                `
                const res1 = await this.mysql_db.query(query1)
                const cost_id = res1[0]?.cost_id
                if (!cost_id) {
                    return reject('cost_id not found')
                }

                const query2 = `DELETE FROM cost WHERE id = ${mysql.escape(cost_id)}`
                await this.mysql_db.query(query2)

                const query3 = `DELETE FROM project WHERE id = ${mysql.escape(project_id)}`
                await this.mysql_db.query(query3)

                await this.mysql_db.commit()
                return resolve()
            } catch (err) {
                logger.error(`[project_service][remove] err: ${err}`)
                await this.mysql_db.rollback()
                return reject(err.sqlMessage)
            }
        })
    }

    update(project_id, project) {
        return new Promise(async (resolve, reject) => {
            let {
                title,
                description,
                income,
                expected_start_time,
                expected_finish_time,
                real_start_time,
                real_finish_time,
                note,
                member,
                cost
            } = project
            income = income ? income : 0
            cost.server = cost.server ? cost.server : 0
            cost.cost_incurred = cost.cost_incurred ? cost.cost_incurred : 0

            try {
                await this.mysql_db.begin_transaction()

                const query1 = `
                    UPDATE project SET
                    title = ${mysql.escape(title)},
                    description = ${mysql.escape(description)},
                    income = ${mysql.escape(income)},
                    expected_start_time = ${mysql.escape(expected_start_time)},
                    expected_finish_time = ${mysql.escape(expected_finish_time)},
                    real_start_time = ${mysql.escape(real_start_time)},
                    real_finish_time = ${mysql.escape(real_finish_time)},
                    note = ${mysql.escape(note)}
                    WHERE id = ${mysql.escape(project_id)}
                `
                await this.mysql_db.query(query1)

                const query2 = `
                    SELECT c.id as cost_id FROM cost AS c JOIN project AS p 
                    ON c.project_id = p.id WHERE p.id = ${mysql.escape(project_id)}
                `
                const res2 = await this.mysql_db.query(query2)
                const cost_id = res2[0]?.cost_id
                if (!cost_id) {
                    return reject('cost_id not found')
                }

                const query3 = `
                    UPDATE cost SET
                    server = ${mysql.escape(cost.server)}, 
                    cost_incurred = ${mysql.escape(cost.cost_incurred)}
                    WHERE id = ${mysql.escape(cost_id)}
                `
                await this.mysql_db.query(query3)

                const query4 = `DELETE FROM pay WHERE cost_id = ${mysql.escape(cost_id)}`
                await this.mysql_db.query(query4)

                const query5 = `DELETE FROM user_project WHERE project_id = ${mysql.escape(project_id)}`
                await this.mysql_db.query(query5)

                for (let i = 0; i < member.length; i++) {
                    let [err, user_id] = await to(this.check_exist_user(member[i].username, this.mysql_db))
                    if(err){
                        return reject(err)
                    }

                    let query6 = `
                        INSERT INTO user_project(user_id, project_id)
                        VALUES(${mysql.escape(user_id)}, ${mysql.escape(project_id)})
                    `
                    await this.mysql_db.query(query6)

                    let query7 = `
                        INSERT INTO pay(cost_id, user_id, value)
                        VALUES(
                        ${mysql.escape(cost_id)},
                        ${mysql.escape(user_id)},
                        ${mysql.escape(member[i].pay)}
                    )`
                    await this.mysql_db.query(query7)
                }

                project.id = project_id
                await this.mysql_db.commit()
                return resolve(project)
            } catch (err) {
                logger.error(`[project_service][update] err: ${err}`)
                await this.mysql_db.rollback()
                return reject(err.sqlMessage)
            }
        })
    }
}

module.exports = ProjectService