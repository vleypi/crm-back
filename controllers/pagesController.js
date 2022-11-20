const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')

class PagesController {

    async getStudents(req,res) {
        try{
            const stundents = await parse(await request(`SELECT user_id,balance,name,surname,gender,phone,email,role FROM users WHERE role = "Ученик"`))
            return res.status(200).json({stundents})
        }
        catch(err){
            console.log(err)
        }
    }

    async getLessons(req,res) {
        try{

            let lessonsDB = await parse(await request(`SELECT * FROM lessons ${req.query.name && `WHERE lesson_name LIKE "%${req.query.name}%"`}`))

            await Promise.all(lessonsDB.map(async (lesson,index)=>{
                const users = parse(await request(`SELECT * FROM lessons_user WHERE lesson_id = "${lesson.lesson_id}"`))
                const status = parse(await request(`SELECT * FROM statuses WHERE id = "${lesson.lesson_status}"`))[0]
                lessonsDB[index].students = users.filter(user=>user.role === 'Ученик').length
                lessonsDB[index].lesson_status = status
            }))

            const statuses = await parse(await request(`SELECT * FROM statuses`))
            const lessons_type = await parse(await request(`SELECT * FROM lessons_type`))
           
            return res.status(200).json({lessons: lessonsDB,statuses,lessons_type})
        }
        catch(err){
            console.log(err)
        }
    }

    async getStatuses(req,res) {
        try{
            const statuses = await parse(await request(`SELECT * FROM statuses`))
            const statuses_visits = await parse(await request(`SELECT * FROM statuses_visits`))
            return res.status(200).json({statuses,statuses_visits})
        }
        catch(err){
            console.log(err)
        }
    }
}

module.exports = new PagesController()