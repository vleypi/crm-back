const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult, param} = require('express-validator')
const parse = require('../settings/parse')
const {RRule, rrulestr} = require('rrule')

class PagesController {

    async getSchedule(req,res){
        try{
            let appointments = []

            let lessons = []

            if(req.user.role == 'Владелец'){
                appointments = await parse(await request(`SELECT * FROM appointments`))
                lessons = await parse(await request(`SELECT * FROM lessons`))
            }
            else if(req.user.role == 'Педагог'){            
                lessons = await parse(await request(`SELECT * FROM lessons WHERE user_id = "${req.user.id}"`))

                await Promise.all(lessons.map(async (lesson,index)=>{
                    const appointment = parse(await request(`SELECT * FROM appointments WHERE lesson_id = "${lesson.lesson_id}"`))[0]
                    appointments.push(appointment)
                }))
            }
            
            return res.status(200).json({
                appointments: appointments.map(appointment=>{
                    return {
                        id: appointment.id,
                        rRule: appointment.rRule,
                        startDate: appointment.startDate,
                        endDate: appointment.endDate,
                        lesson_id: appointment.lesson_id,
                        notes: appointment.notes,
                        allDay: 0,
                        title: lessons.find((lesson)=>lesson.lesson_id === appointment.lesson_id).lesson_name
                    }
                }),
                lessons: lessons.map(lesson=>{
                    return {
                        id: lesson.lesson_id,
                        text: lesson.lesson_name,
                        color: lesson.lesson_color,
                        lesson_link:lesson.lesson_link
                    }
                })
            })
        }
        catch(err){
            console.log(err)
        }
    }

    async getVisits(req,res){
        try{
            const {day,month,year,lesson_id} = req.query

            const appointments = await parse(await request(`SELECT * FROM appointments`))

            const addDays = (date, hours) => {
                const result = new Date(date);
                result.setHours(result.getHours() + hours);
                return result
            }

            const appointmentsArr = []

            appointments.map((appointment)=>{
                if(appointment.rRule){
                    const rule = RRule.fromString(appointment.rRule)
                    rule.options.dtstart = new Date(year,month,day)
                    
                    const dates = rule.between(addDays(rule.options.dtstart,0),addDays(new Date(year,month,day),23))

                    if(dates.length){
                        appointmentsArr.push(appointment)
                    }
                }
                else{
                    const appointmentDate = new Date(appointment.endDate)
                    const appointmentDay = appointmentDate.getDate()
                    const appointmentMonth = appointmentDate.getMonth()
                    const appointmentYear = appointmentDate.getFullYear()

                    if(appointmentDay == day && appointmentMonth == month && appointmentYear == year){
                        appointmentsArr.push(appointment)
                    }
                }
            })

            if(lesson_id){
                const lesson = await parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${lesson_id}"`))[0]

                if(!lesson){
                    return res.status(404).json({})
                }

                const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE lesson_id ="${req.query.lesson_id}"`))
            
                if(!lessons_user.length){
                    return res.status(200).json({appointments: appointmentsArr,lesson,participants: []})
                }

                const participants = []

                await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                    const participant = parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE user_id = "${lesson_user.user_id}"`))[0]
                    participants.push(participant)
                }))

                return res.status(200).json({appointments: appointmentsArr,lesson,participants})
            }
            else{
                return res.status(200).json({appointments: appointmentsArr,lesson: {},participants: []})
            }
            
        }
        catch(err){
            console.log(err)
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
    
    async getStudentSchedule(req,res){
        try{
            const {user_id} = req.query

            const user = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE user_id = "${user_id}"`))[0]
            
            if(!user){
                return res.status(404).json({mes: 'User not found'})
            }

            const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE user_id = "${user_id}"`))

            const appointments = []

            const lessons = []

            await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                const appointment = parse(await request(`SELECT * FROM appointments WHERE lesson_id = "${lesson_user.lesson_id}"`))[0]
                if(appointment){
                    appointments.push(appointment)
                }
            }))

            await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                const lesson = parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${lesson_user.lesson_id}"`))[0]
                if(lesson){
                    lessons.push(lesson)
                }
            }))

            return res.status(200).json({
                appointments: appointments.map(appointment=>{
                    return {
                        id: appointment.id,
                        rRule: appointment.rRule,
                        startDate: appointment.startDate,
                        endDate: appointment.endDate,
                        lesson_id: appointment.lesson_id,
                        notes: appointment.notes,
                        allDay: 0,
                        title: lessons.find((lesson)=>lesson.lesson_id === appointment.lesson_id).lesson_name
                    }
                }),
                lessons: lessons.map(lesson=>{
                    return {
                        id: lesson.lesson_id,
                        text: lesson.lesson_name,
                        color: lesson.lesson_color,
                        lesson_link:lesson.lesson_link
                    }
                }),
                student: user
            })
        }
        catch(err){
            console.log(err)
        }
    }

    async getTeacherSchedule(req,res){
        try{
            const {user_id} = req.query

            const user = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE user_id = "${user_id}"`))[0]
            
            if(!user){
                return res.status(404).json({mes: 'User not found'})
            }

            const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE user_id = "${user_id}"`))

            const appointments = []

            const lessons = []

            await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                const appointment = parse(await request(`SELECT * FROM appointments WHERE lesson_id = "${lesson_user.lesson_id}"`))[0]
                if(appointment){
                    appointments.push(appointment)
                }
            }))

            await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                const lesson = parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${lesson_user.lesson_id}"`))[0]
                if(lesson){
                    lessons.push(lesson)
                }
            }))

            return res.status(200).json({
                appointments: appointments.map(appointment=>{
                    return {
                        id: appointment.id,
                        rRule: appointment.rRule,
                        startDate: appointment.startDate,
                        endDate: appointment.endDate,
                        lesson_id: appointment.lesson_id,
                        notes: appointment.notes,
                        allDay: 0,
                        title: lessons.find((lesson)=>lesson.lesson_id === appointment.lesson_id).lesson_name
                    }
                }),
                lessons: lessons.map(lesson=>{
                    return {
                        id: lesson.lesson_id,
                        text: lesson.lesson_name,
                        color: lesson.lesson_color,
                        lesson_link:lesson.lesson_link
                    }
                }),
                teacher: user
            })
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