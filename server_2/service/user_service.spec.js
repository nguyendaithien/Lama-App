const expect = require('chai').expect
const MysqlDB = require('../model/mysql/mysql')
const UserService = require('./user_service')
const {to} = require('../helper/to')

let user_service

describe('backend/users/login', () => {
    beforeEach(async () => {
        const mysql_db = new MysqlDB()
        const query = 'DELETE FROM user'
        await mysql_db.query(query)

        user_service = new UserService(mysql_db)
    })

    it('should insert user to user table', async () => {
        const user = {
            mail: 'a@gmail.com',
            user: 'duydeptrai',
            username: 'duydeptrai',
            password: 'duydeptrai'
        }

        const [err, result] = await to(user_service.register(user))
        expect(err).to.equal(null)
        expect(result.affectedRows).to.equal(1)
    })

    it('should not insert user with same username or mail', async () => {
        const user1 = {
            mail: 'a@gmail.com',
            user: 'duydeptrai',
            username: 'duydeptrai',
            password: 'duydeptrai'
        }

        const [err1, result1] = await to(user_service.register(user1))
        expect(err1).to.equal(null)
        expect(result1.affectedRows).to.equal(1)

        // user2 has the same mail with user1
        const user2 = {
            mail: 'a@gmail.com',
            user: 'duydeptrai2',
            username: 'duydeptrai2',
            password: 'duydeptrai'
        }

        const [err2, result2] = await to(user_service.register(user2))
        expect(err2.code).to.equal('ER_DUP_ENTRY')

        // user3 has the same username with user1
        const user3 = {
            mail: 'user3@gmail.com',
            user: 'duydeptrai2',
            username: 'duydeptrai',
            password: 'duydeptrai'
        }

        const [err3, result3] = await to(user_service.register(user3))
        expect(err3.code).to.equal('ER_DUP_ENTRY')
    })
})