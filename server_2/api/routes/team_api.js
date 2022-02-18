'use strict'

const express = require('express')

const MysqlDB = require('../../model/mysql/mysql')
const TeamService = require('../../service/team_service')
const {verify_token, check_required_field} = require('../middlewares')

const team_api = express.Router()
const mysql_db = new MysqlDB()
const team_service = new TeamService(mysql_db)

team_api.get('/list', verify_token, async (req, res, next) => {
    try {
        const data = await team_service.get_all_team()
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message: err})
    }
})

team_api.get('/find', verify_token, async (req, res, next) => {
    try {
        const {id, name} = req.query

        if ((id && name) || (!id && !name)) {
            return res.status(500).json({message: 'please pass only one parameter: id or name'})
        }
        if (id) {
            const data = await team_service.get_team_info_by_id(id)
            return res.status(200).json(data)
        }
        if (name) {
            const data = await team_service.get_team_info_by_name(name)
            return res.status(200).json(data)
        }
    } catch (err) {
        res.status(500).json({message: err})
    }
})

team_api.put('/add-user', verify_token, check_required_field(['username', 'team_id']), async (req, res, next) => {
    let {username, team_id} = req.body
    try {
        const user_id = await team_service.check_exist_user(username)
        const result = await team_service.add_user(user_id, team_id)
        if (result.changedRows === 0) {
            return res.status(500).json({message: `user ${username} is already in this team`})
        }

        return res.status(200).json({
            message: `added user to this team`,
            data: result[0]
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: err})
    }
})

team_api.put('/remove-user', verify_token, check_required_field(['username', 'team_id']), async (req, res, next) => {
    let {username, team_id} = req.body
    try {
        const user_id = await team_service.check_user_in_team(username, team_id)
        await team_service.remove_user(user_id)
        res.status(200).json({message: 'removed user', team_id, username})
    } catch (err) {
        return res.status(500).json({message: err})
    }
})

team_api.post('/create', verify_token, check_required_field(['name']), async (req, res, next) => {
    try {
        const {name} = req.body
        const id = await team_service.create(name)
        return res.status(200).json({message: 'created team', id})
    } catch (err) {
        return res.status(500).json({message: err})
    }
})

module.exports = team_api
