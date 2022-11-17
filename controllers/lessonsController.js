const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')

class LessonsController {

    async getLessons(req,res) {
        try{
            const lessons = await parse(await request('SELECT * FROM '))
        }
        catch(err){
            console.log(err)
        }
    }
}

module.exports = new LessonsController()