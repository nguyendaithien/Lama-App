'use strict'

const mysql = require('mysql')
const expect = require('chai').expect

const MySqlDB = require('../model/mysql/mysql')
const TeamService = require('./team_service')
const {to} = require('../helper/to')

let team_service

describe('[team_service][find_function]', () => {
    beforeEach(async () => {
        const mysql_db = new MySqlDB()
        team_service = new TeamService(mysql_db)
    })

    it('should get team data by right id', async () => {
        const id = 1
        const [err, result] = await to(team_service.get_team_info_by_id(id))
        expect(err).to.equal(null)
        expect(result.length).to.greaterThan(0)
        expect(result[0].hasOwnProperty('user_id'))
        expect(result[0].hasOwnProperty('name'))
        expect(result[0].hasOwnProperty('username'))
        expect(result[0].hasOwnProperty('mail'))
        expect(result[0]).haveOwnProperty('team_id').equal(id)
        expect(result[0].hasOwnProperty('team'))
    })

    it('should get team data by right name', async () => {
        const name = 'Web Cloud'
        const [err, result] = await to(team_service.get_team_info_by_name(name))
        expect(err).to.equal(null)
        expect(result.length).to.greaterThan(0)
        expect(result[0].hasOwnProperty('user_id'))
        expect(result[0].hasOwnProperty('name'))
        expect(result[0].hasOwnProperty('username'))
        expect(result[0].hasOwnProperty('mail'))
        expect(result[0].hasOwnProperty('team_id'))
        expect(result[0]).haveOwnProperty('team').equal(name)
    })

    it('should get no data when passing wrong id', async () => {
        const id = 9999
        const [err, result] = await to(team_service.get_team_info_by_id(id))
        expect(err).to.equal(null)
        expect(result.length).to.equal(0)
    })

    it('should get no data when passing wrong name', async () => {
        const name = 'duy dep trai'
        const [err, result] = await to(team_service.get_team_info_by_name(name))
        expect(err).to.equal(null)
        expect(result.length).to.equal(0)
    })
})

describe('[team_service][add_user]', () => {
    beforeEach(async () => {
        const mysql_db = new MySqlDB()
        team_service = new TeamService(mysql_db)

        // Remove team_id of user with id 8 before each test (There are 8 fixed users to test)
        const query = `UPDATE user SET team_id = null WHERE id = 8`
        await mysql_db.query(query)
    })

    it('should add an user to team by setting foreign key team_id equals to id of team table', async () => {
        const user_id = 8, team_id = 1
        const [err, result] = await to(team_service.add_user(user_id, team_id))
        expect(err).to.equal(null)
        expect(result.affectedRows).to.equal(1)
        expect(result.changedRows).to.equal(1)
    })
})

describe('[team_service][remove_user]', () => {
    beforeEach(async () => {
        const mysql_db = new MySqlDB()
        team_service = new TeamService(mysql_db)

        // Add user id 7 to team before test (There are 8 fixed users to test)
        const query = `UPDATE user SET team_id = 1 WHERE id = 7`
        await mysql_db.query(query)
    })

    it('should remove an user from team by setting foreign key team_id equals to id of team table', async () => {
        const user_id = 7, team_id = 1
        const [err, result] = await to(team_service.remove_user(user_id, team_id))
        expect(err).to.equal(null)
        expect(result.affectedRows).to.equal(1)
        expect(result.changedRows).to.equal(1)
    })
})

describe('[team_service][check_exist_user]', () => {
    beforeEach(async () => {
        const mysql_db = new MySqlDB()
        team_service = new TeamService(mysql_db)
    })

    it('should return error when username does not exist', async () => {
        const username = 'abcxyz'
        const [err, result] = await to(team_service.check_exist_user(username))
        expect(err).to.equal('user not found')
        expect(result).to.equal(undefined)
    })

    it('should return user id when username exists', async () => {
        const username = 'string8'
        const [err, result] = await to(team_service.check_exist_user(username))
        expect(err).to.equal(null)
        expect(typeof(result)).to.equal('number')
    })
})

describe('[team_service][check_user_in_team]', () => {
    beforeEach(async () => {
        const mysql_db = new MySqlDB()
        team_service = new TeamService(mysql_db)

        // Remove user string7 from team 1 before test
        const query1 = `UPDATE user SET team_id = null WHERE username = 'string7'`
        await mysql_db.query(query1)
        // Add user string8 to team 1 before test
        const query2 = `UPDATE user SET team_id = 1 WHERE username = 'string8'`
        await mysql_db.query(query2)

    })

    it('should return error when user is not in team', async () => {
        const username = 'string7', team_id = 1
        const [err, result] = await to(team_service.check_user_in_team(username, team_id))
        expect(err).to.equal('user not in team')
        expect(result).to.equal(undefined)
    })

    it('should return user id when user is in team', async () => {
        const username = 'string8', team_id = 1
        const [err, result] = await to(team_service.check_user_in_team(username, team_id))
        expect(err).to.equal(null)
        expect(result).to.equal(8)
    })
})
