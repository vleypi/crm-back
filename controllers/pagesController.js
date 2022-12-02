const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult, param} = require('express-validator')
const parse = require('../settings/parse')
const {RRule} = require('rrule')

class PagesController {

    async getSchedule(req,res){
        try{
            const appointments = await parse(await request(`SELECT * FROM appointments`))

            const lessons = await parse(await request(`SELECT * FROM lessons`))


            return res.status(200).json({
                appointments,
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

            const getLessonAndParticipants = async () => {
                try{
                    const lesson = await parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${lesson_id}"`))[0]

                    if(!lesson){
                        return res.status(404).json({mes: 'Занятие не найдено'})  
                    }

                    const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE lesson_id ="${lesson_id}"`))
                    
                    if(!lessons_user.length){
                        return res.status(200).json({participants: [],lesson})
                    }

                    const participants = []

                    await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                        const participant = parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE user_id = "${lesson_user.user_id}"`))[0]
                        participants.push(participant)
                    }))


                    const statuses_visits = await parse(await request(`SELECT * FROM statuses_visits`))

                    const visit = await parse(await request(`SELECT * FROM visits WHERE lesson_id = "${lesson_id}" AND day="${day}" AND month="${month}" AND year="${year}"`))[0]

                    const visits_users = await parse(await request(`SELECT * FROM visits_users WHERE visit_id = "${visit.visit_id}"`))



                    return res.status(200).json({
                        participants,
                        lesson,
                        statuses_visits: statuses_visits.map((status)=>{
                            return {
                                value: status.status_id,
                                status_id: status.status_id,
                                status_color: status.status_color,
                                label: status.status_name
                            }
                        }),
                        visits_users,
                        visit_id: visit.visit_id
                    })
                }
                catch(err){
                    console.log(err)
                }
            }

            const visit = await parse(await request(`SELECT * FROM visits WHERE lesson_id = "${lesson_id}" AND day="${day}" AND month="${month}" AND year="${year}"`))

            if(visit.length){
                await getLessonAndParticipants()
            }

            const appointment = await parse(await request(`SELECT * FROM appointments WHERE lesson_id = "${lesson_id}"`))[0]

            const ruleStr = RRule.fromString(appointment.rRule)
            
            ruleStr.options.dtstart = new Date(year,month,day,0,0)

            const addDays = (date, days) => {
                const result = new Date(date);
                result.setDate(result.getDate() + days);
                return result
            }

            const checkVisitPage = ruleStr.between(new Date(year,month,day),addDays(new Date(year,month,day),2))

            if(checkVisitPage.length){
                const visit_id = shortid.generate()

                await parse(await request("INSERT INTO `visits` (`visit_id`,`lesson_id`,`day`,`month`,`year`) VALUES('" + visit_id + "','" + lesson_id + "','" + day + "','" + month + "','" + year + "')")) 
            
                await getLessonAndParticipants()
            }
            else{
                return res.status(404).json({})
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

            await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                const appointment = parse(await request(`SELECT * FROM appointments WHERE lesson_id = "${lesson_user.lesson_id}"`))[0]
                if(appointment){
                    appointments.push(appointment)
                }
            }))

            return res.status(200).json({appointments,student: user})
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