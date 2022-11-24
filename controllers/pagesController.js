const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')

class PagesController {

    async getUser(req,res){
        try{
            

            return user
        }
        catch(err){
            return res.status(404).json({mes: 'Пользоатель не найден'})
        }
    }

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

    async getTeachers(req,res) {
        try{
            const teachers = await parse(await request(`SELECT * FROM users WHERE role = "${'Педагог'}"`))
            return res.status(200).json({teachers})
        }
        catch(err){
            console.log()
        }
    }

    //

    async getStudentLessons(req,res){
        try{

            const user = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE user_id = "${req.query.user_id}"`))[0]

            if(!user){
                return res.status(404).json({mes: 'Пользоатель не найден'})  
            }

            if(user.role != 'Ученик'){
                return res.status(404).json({})
            }

            const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE user_id ="${req.query.user_id}" AND role = "Ученик"`))
            
            if(!lessons_user.length){
                return res.status(200).json({lessons: [],student: user})
            }

            const lessons = []

            await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                const lesson = parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${lesson_user.lesson_id}"`))[0]
                lessons.push(lesson)
            }))

            await Promise.all(lessons.map(async (lesson,index)=>{
                const users = parse(await request(`SELECT * FROM lessons_user WHERE lesson_id = "${lesson.lesson_id}"`))
                const status = parse(await request(`SELECT * FROM statuses WHERE id = "${lesson.lesson_status}"`))[0]
                lessons[index].students = users.filter(user=>user.role === 'Ученик').length
                lessons[index].lesson_status = status
            }))

            return res.status(200).json({student: user,lessons})
        }
        catch(err){
            console.log(err)
        }
    }


    async getTeacherLessons(req,res){
        try{
            console.log(2)
            const user = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE user_id = "${req.query.user_id}"`))[0]
            console.log(user)
            if(!user){
                return res.status(404).json({mes: 'Пользоатель не найден'})  
            }

            if(user.role != 'Педагог'){
                return res.status(404).json({})
            }

            const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE user_id ="${req.query.user_id}" AND role = "Педагог"`))
            
            if(!lessons_user.length){
                return res.status(200).json({lessons: [],teacher: user})
            }

            const lessons = []

            await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                const lesson = parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${lesson_user.lesson_id}"`))[0]
                lessons.push(lesson)
            }))

            await Promise.all(lessons.map(async (lesson,index)=>{
                const users = parse(await request(`SELECT * FROM lessons_user WHERE lesson_id = "${lesson.lesson_id}"`))
                const status = parse(await request(`SELECT * FROM statuses WHERE id = "${lesson.lesson_status}"`))[0]
                lessons[index].students = users.filter(user=>user.role === 'Ученик').length
                lessons[index].lesson_status = status
            }))

            return res.status(200).json({teacher: user,lessons})
        }
        catch(err){
            console.log(err)
        }
    }

    async getLessonParticipants(req,res){
            const lesson = await parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${req.query.lesson_id}"`))[0]

            if(!lesson){
                return res.status(404).json({mes: 'Занятие не найдено'})  
            }

            const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE lesson_id ="${req.query.lesson_id}"`))
            
            if(!lessons_user.length){
                return res.status(200).json({participants: [],lesson})
            }

            const participants = []

            await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                const participant = parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE user_id = "${lesson_user.user_id}"`))[0]
                participants.push(participant)
            }))
            console.log(participants)

            return res.status(200).json({participants,lesson})
    }
}

module.exports = new PagesController()