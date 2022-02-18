'use strict'

const request = require('supertest')
const should = require('chai').should()

const MySqlDB = require('../../model/mysql/mysql')
const TeamService = require('../../service/team_service')
const server = require('../../server')
const logger = require('../../logger')

const mysql_db = new MySqlDB()
const team_service = new TeamService(mysql_db)

describe('Team Api', () => {
    describe('GET /find', () => {
        it('should get info of team with right id or team name', async () => {
            const [user_id, team_id, team_name] = [8, 1, 'Web Cloud']
            try {
                await team_service.add_user(user_id, team_id)

                let res = await request(server).get(`/backend/teams/find?id=${team_id}`)
                res.status.should.equal(200)
                res.body.should.be.a('array')
                res.body.length.should.be.greaterThan(0)
                res.body[0].should.have.property('user_id')
                res.body[0].should.have.property('name')
                res.body[0].should.have.property('username')
                res.body[0].should.have.property('mail')
                res.body[0].should.have.property('team_id').equal(1)
                res.body[0].should.have.property('team')

                res = await request(server).get(`/backend/teams/find?name=${team_name}`)
                res.status.should.equal(200)
                res.body.should.be.a('array')
                res.body.length.should.be.greaterThan(0)
                res.body[0].should.have.property('user_id')
                res.body[0].should.have.property('name')
                res.body[0].should.have.property('username')
                res.body[0].should.have.property('mail')
                res.body[0].should.have.property('team_id')
                res.body[0].should.have.property('team').equal(team_name)
            } catch (err) {
                logger.error(`GET /find err: ${err}`)
            }
        })

        it('should get error when passing both id and team', async () => {
            const [team_id, team_name] = [1, 'Web Clown']
            try {
                let res = await request(server).get(`/backend/teams/find?id=${team_id}&name=${team_name}`)
                res.status.should.equal(500)
                res.body.should.be.a('object')
                res.body.message.should.equal('please pass only one parameter: id or name')
            } catch (err) {
                logger.error(`GET /find err: ${err}`)
            }
        })

        it('should get error when passing wrong id or name', async () => {
            const [team_id, team_name] = [9999, 'abcxyz']
            try {
                let res = await request(server).get(`/backend/teams/find?name=${team_name}`)
                res.status.should.equal(500)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eqls('team not found')

                res = await request(server).get(`/backend/teams/find?id=${team_id}`)
                res.status.should.equal(500)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eqls('team not found')
            } catch (err) {
                logger.error(`GET /find err: ${err}`)
            }
        })
    })

    describe('PUT /add-user', () => {
        it('should add an user to the team', async () => {
            const user_id = 8, username = 'string8'
            const data_to_send = {team_id: 1, username: username}
            try {
                await team_service.remove_user(user_id).then().catch(err => console.log(err))
                const res = await request(server).put('/backend/teams/add-user').send(data_to_send)
                res.status.should.eqls(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eqls('added user to this team')
                res.body.should.have.property('team_id').eqls(data_to_send.team_id)
                res.body.should.have.property('username').eqls(data_to_send.username)
            } catch (err) {
                logger.error(`PUT /add-user err: ${err}`)
            }
        })

        it('should return an error when no user found', async () => {
            const username = 'abcxyz'
            const data_to_send = {team_id: 1, username}
            try {
                const res = await request(server).put('/backend/teams/add-user').send(data_to_send)
                res.status.should.equal(500)
                res.body.should.be.a('object')
                res.body.should.have.property('message').equal('user not found')
            } catch (err) {
                logger.error(`PUT /add-user err: ${err}`)
            }
        })

        it('should return an error if user had been already in team', async () => {
            const user_id = 8
            const data_to_send = {team_id: 1, username: 'string8'}
            try {
                await team_service.add_user(user_id, data_to_send.team_id)
                const res = await request(server).put('/backend/teams/add-user').send(data_to_send)
                res.status.should.equal(500)
                res.body.should.be.a('object')
                res.body.should.have.property('message').equal(`user '${data_to_send.username}' has been already in this team`)
            } catch (err) {
                logger.error(`PUT /add-user err: ${err}`)
            }
        })
    })

    describe('PUT /remove-user', () => {
        it('should remove an user from the team', async () => {
            const user_id = 8
            const data_to_send = {team_id: 1, username: 'string8'}
            try {
                await team_service.add_user(user_id, data_to_send.team_id)
                const res = await request(server).put('/backend/teams/remove-user').send(data_to_send)
                res.status.should.eqls(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eqls('removed user')
                res.body.should.have.property('team_id').eqls(data_to_send.team_id)
                res.body.should.have.property('username').eqls(data_to_send.username)
            } catch (err) {
                logger.error(`PUT /remove-user err: ${err}`)
            }
        })

        it('should return an error if user does not exist', async () => {
            const data_to_send = {team_id: 1, username: 'abcxyz'}
            try {
                const res = await request(server).put('/backend/teams/remove-user').send(data_to_send)
                res.status.should.eqls(500)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eqls('user not found')
            } catch (err) {
                logger.error(`PUT /remove-user err: ${err}`)
            }
        })

        it('should return an error if user is not in the team', async () => {
            const user_id = 8
            const data_to_send = {team_id: 1, username: 'string8'}
            try {
                await team_service.remove_user(user_id)
                const res = await request(server).put('/backend/teams/remove-user').send(data_to_send)
                res.status.should.eqls(500)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eqls('user not in team')
            } catch (err) {
                logger.error(`PUT /remove-user err: ${err}`)
            }
        })
    })
})