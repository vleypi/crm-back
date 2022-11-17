const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')

class LessonsController {

    async getLessons(req,res) {
        try{
            const lessons = await parse(await request('SELECT * FROM lessons'))
        }
        catch(err){
            console.log(err)
        }
    }

    async addLessons(req,res){
        try{
            const {lesson_type,lesson_title,lesson_desc,lesson_color} = req.body
            parse(await request("INSERT INTO `tokens` (`lesson_id`,`lesson_type`,`lesson_title`,`lesson_desc`,`lesson_color`) VALUES('" + shortid.generate() + "','" + emailCheck[0].user_id + "','" + refreshToken + "')")) 

            await parse(await request("INSERT INTO `lessons` ()"))
        }
        catch(err){

        }
    }
}

module.exports = new LessonsController()