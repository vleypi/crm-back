const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')

class PagesController {

    async getStudents(req,res) {
        try{
            console.log(req.user.id)
            return res.status(200).json({user_id: req.user.id})
            // const lessons = await parse(await request('SELECT * FROM lessons'))
        }
        catch(err){
            console.log(err)
        }
    }

}

module.exports = new PagesController()