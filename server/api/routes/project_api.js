'use strict'

const express = require('express')

const {verify_token, check_required_field} = require('../middlewares')
const MySqlDB = require('../../model/mysql/mysql')
const ProjectService = require('../../service/project_service')

const project_api = express.Router()
const mysql_db = new MySqlDB()
const project_service = new ProjectService(mysql_db)

project_api.get('/list', verify_token, async (req, res, next) => {
    try {
        const result = await project_service.find_all()
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({message: err})
    }
})

project_api.get('/find', verify_token, async (req, res, next) => {
    const {id, title} = req.query
    if ((!id && !title) || (id && title)) {
        return res.status(500).json({message: 'required one parameter: id or title'})
    }
    try {
        await project_service.check_exist_project(id, title)
        let result
        if (id) {
            result = await project_service.find_by_id(id)
        } else {
            result = await project_service.find_by_title(title)
        }
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({message: err})
    }
})

project_api.post('/create',
    verify_token,
    check_required_field(['title', 'description', 'income', 'member', 'cost', 'expected_start_time', 'expected_finish_time', 'real_start_time', 'real_finish_time']),
    async (req, res, next) => {
        const project = req.body
        try {
            const data = await project_service.create(project)
            return res.status(200).json({message: 'created project', data})
        } catch (err) {
            return res.status(500).json({message: err})
        }
    })

project_api.delete('/delete/:id',
    verify_token,
    async (req, res, next) => {
        try {
            const {id} = req.params
            await project_service.check_exist_project(id)
            await project_service.delete(id)
            return res.status(200).json({message: "removed project"})
        } catch (err) {
            return res.status(500).json({message: err})
        }
    })

project_api.put('/edit/:id',
    verify_token,
    check_required_field(['title', 'description', 'income', 'member', 'cost', 'expected_start_time', 'expected_finish_time', 'real_start_time', 'real_finish_time']),
    async (req, res, next) => {
        try {
            const {id} = req.params
            const project = req.body
            await project_service.check_exist_project(id)
            const data = await project_service.update(id, project)
            return res.status(200).json({message: 'edited project', data})
        } catch (err) {
            return res.status(500).json({message: err})
        }
    })

module.exports = project_api