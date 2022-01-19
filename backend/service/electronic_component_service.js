'use strict'

const mysql = require('mysql')
const read_excel_file = require('read-excel-file/node')
const fs = require('fs/promises')

const logger = require('../logger')
const {to} = require('../helper/to')

class ElectronicComponentService {
    constructor(mysql_db) {
        this.mysql_db = mysql_db
    }

    get_list_component(project_id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT electronic_component.id, electronic_component.name, price, amount, (price * amount) AS total_cost
                FROM electronic_component JOIN project 
                ON electronic_component.project_id = project.id
                WHERE project_id = ${mysql.escape(project_id)} 
            `
            const [err, data] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[electronic_component_service][get_list_component] err: ${err}`)
                return reject(err)
            }
            return resolve(data)
        })
    }

    post_list_component(electronic_components, project_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.mysql_db.begin_transaction()
                const query = `DELETE FROM electronic_component WHERE project_id = ${mysql.escape(project_id)}`
                await this.mysql_db.query(query)

                for (let i = 0; i < electronic_components.length; i++) {
                    let electronic_component = electronic_components[i]
                    let query = `
                        INSERT INTO electronic_component(name, price, amount, project_id) VALUES(
                        ${mysql.escape(electronic_component.name)},
                        ${mysql.escape(electronic_component.price)},
                        ${mysql.escape(electronic_component.amount)},
                        ${mysql.escape(project_id)})
                    `
                    await this.mysql_db.query(query)
                }

                await this.mysql_db.commit()
                return resolve('upload file successfully')
            } catch (err) {
                await this.mysql_db.rollback()
                logger.error(`[electronic_component_service][post_list_component] err: ${err}`)
                return reject(err.sqlMessage)
            }
        })
    }

    read_excel_file(file_name) {
        return new Promise((resolve, reject) => {
            const path = __dirname + '/../data/' + file_name

            let electronic_components = []
            read_excel_file(path)
                .then(async (rows) => {
                    await fs.unlink(path)
                    rows.shift()
                    rows.forEach(row => {
                        let electronic_component = {
                            name: row[0],
                            price: row[1],
                            amount: row[2],
                        }
                        electronic_components.push(electronic_component)
                    })
                    return resolve(electronic_components)
                })
                .catch(async (err) => {
                    await fs.unlink(path)
                    logger.error(`[electronic_component_service][read_excel_file] err: ${err}`)
                    return reject('cannot read this file')
                })
        })
    }

    check_exist_project(project_id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * FROM project WHERE id = ${mysql.escape(project_id)}
            `
            const [err, result] = await to(this.mysql_db.p_query(query))
            if (err) {
                logger.error(`[electronic_component_service][check_exist_project] err: ${err}`)
                return reject(err)
            }
            if (result.length === 0) {
                return reject('project not found')
            }
            return resolve(project_id)
        })
    }
}

module.exports = ElectronicComponentService
