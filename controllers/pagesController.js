const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult, param} = require('express-validator')
const parse = require('../settings/parse')
const {RRule, rrulestr} = require('rrule')
const uab = require('unique-array-objects')

class PagesController {

    async getEditor(req,res){
        try{

            const {blog_id} = req.query


            if(!blog_id){
                return res.status(200).json({blog: {header: '',blocks: []},role: req.user.role})

            }
            else if(blog_id){
                const blog = await parse(await request(`SELECT * FROM blog WHERE blog_id = "${blog_id}"`))[0]

                if(!blog.blog_id){
                    return res.status(404).json({})
                }

                return res.status(200).json({blog: {header: blog.header,blocks: JSON.parse(blog.blocks),blog_id: blog.blog_id},role: req.user.role})
            }
        }
        catch(err){
            return res.status(404).json({})
        }
    }

    async getPosts(req,res){
        try{
            const blog = await parse(await request(`SELECT * FROM blog ORDER BY date DESC`))

            const posts = []

            await Promise.all(blog.map(async (post,index)=>{
                posts.push({
                    blog_id: post.blog_id,
                    header: post.header,
                    image: JSON.parse(post.blocks).find((item)=>item.type == 'image') ? JSON.parse(post.blocks).find((item)=>item.type == 'image').data.file.url  : ''
                })
            }))


            return res.status(200).json({posts})
        }
        catch(err){
            console.log(err)
            return res.status(404).json({})
        }
    }

    async getBlog(req,res){
        try{
            const blog = await parse(await request(`SELECT * FROM blog ORDER BY date DESC`))

            const posts = []

            await Promise.all(blog.map(async (post,index)=>{
                posts.push({
                    blog_id: post.blog_id,
                    header: post.header,
                    blocks: JSON.parse(post.blocks),
                    date: post.date
                })
            }))


            return res.status(200).json({posts})
        }
        catch(err){
            console.log(err)
            return res.status(404).json({})
        }
    }

    async getPost(req,res){
        try{
            const blog = await parse(await request(`SELECT * FROM blog ORDER BY date DESC`))

            const posts = []

            await Promise.all(blog.map(async (post,index)=>{
                posts.push({
                    blog_id: post.blog_id,
                    header: post.header,
                    blocks: JSON.parse(post.blocks),
                    date: post.date
                })
            }))


            return res.status(200).json({posts})
        }
        catch(err){
            console.log(err)
            return res.status(404).json({})
        }
    }

    async getProfile(req,res){
        try{
            
            const user = await parse(await request(`SELECT user_id,name,avatar FROM users WHERE user_id = "${req.user.id}"`))[0]

            if(!user){
                return res.status(404).json({})
            }
            
            return res.status(200).json({user,role: req.user.role})
        }
        catch(err){
            console.log(err)
        }
    }

    async getRole(req,res){
        try{
            
            const user = await parse(await request(`SELECT user_id,name,avatar FROM users WHERE user_id = "${req.user.id}"`))[0]

            if(!user){
                return res.status(404).json({})
            }
            
            return res.status(200).json({role: req.user.role})
        }
        catch(err){
            console.log(err)
        }
    }


    async getSchedule(req,res){
        try{
            let appointments = []

            let lessons = []

            if(req.user.role == 'Владелец'){
                appointments = await parse(await request(`SELECT * FROM appointments`))
                lessons = await parse(await request(`SELECT * FROM lessons`))
            }
            else if(req.user.role == 'Педагог' || req.user.role == 'Ученик'){   
                
                const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE user_id = "${req.user.id}"`))
                
                
                await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                    const lesson = await parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${lesson_user.lesson_id}"`))[0]
                    lessons.push(lesson)
                }))

                await Promise.all(lessons.map(async (lesson,index)=>{
                    const appointmentsUser = parse(await request(`SELECT * FROM appointments WHERE lesson_id = "${lesson.lesson_id}"`))
                    await Promise.all(appointmentsUser.map(async (appointment,index)=>{
                        if(appointment){
                            appointments.push(appointment)
                        }
                    }))
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
                }),
                role: req.user.role
            })
        }
        catch(err){
            console.log(err)
        }
    }

    async getVisits(req,res){
        try{
            const {day,month,year,appointment_id} = req.query

            let appointments = []

            if(req.user.role == 'Владелец'){
                appointments = await parse(await request(`SELECT * FROM appointments`))
            }
            else if(req.user.role == 'Педагог' || req.user.role == 'Ученик'){
                const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE  user_id = "${req.user.id}"`))
                
                await Promise.all(lessons_user.map(async (lesson_user,index)=>{

                    const appointmentsUser = parse(await request(`SELECT * FROM appointments WHERE lesson_id = "${lesson_user.lesson_id}"`))
                    await Promise.all(appointmentsUser.map(async (appointment,index)=>{
                        if(appointment){
                            appointments.push(appointment)
                        }
                    }))
                }))
            }
            else{
                return res.status(404).json({})
            }
            

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

            

            await Promise.all(appointmentsArr.map(async (appointment,index)=>{
                const lesson = await parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${appointment.lesson_id}"`))[0]
                appointmentsArr[index].lesson_name = lesson.lesson_name 
            }))


            
            if(appointment_id){
                const appointment = await parse(await request(`SELECT * FROM appointments WHERE id = "${appointment_id}"`))[0]

                const lesson =  await parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${appointment.lesson_id}"`))[0]

                if(!appointment){
                    return res.status(404).json({})
                }

                let lessons_user = []

                if(req.user.role == 'Ученик'){
                    lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE lesson_id ="${appointment.lesson_id}" AND user_id = "${req.user.id}"`))
                }
                else{
                    lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE lesson_id ="${appointment.lesson_id}"`))
                }
            
                if(!lessons_user.length){
                    return res.status(200).json({appointments: appointmentsArr,lesson,participants: [],role: req.user.role})
                }

                const participants = []

                await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                    const participant = parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE user_id = "${lesson_user.user_id}"`))[0]
                    participants.push(participant)
                }))

                const visits_users = await parse(await request(`SELECT * FROM visits_users WHERE appointment_id = "${appointment_id}" AND lesson_id = "${appointment.lesson_id}" AND day = "${day}" AND year = "${year}" AND month = "${month}"`))

                const statuses_visits = await parse(await request(`SELECT * FROM statuses_visits`))


                return res.status(200).json({
                    appointments: appointmentsArr,
                    lesson,participants,
                    visits_users,
                    role: req.user.role,
                    statuses_visits: statuses_visits.map((status)=>{
                        return {
                            status_id: status.status_id,
                            status_name: status.status_name,
                            status_color: status.status_color,
                            label: status.status_name,
                            value: status.status_id,
                        }
                    })
                })
            }
            else{
                return res.status(200).json({appointments: appointmentsArr,lesson: {},participants: [],role: req.user.role,visits_users: []})
            } 

        }
        catch(err){
            console.log(err)
        }
    }

    async getStudents(req,res) {
        try{

            let stundents = []

            if(req.user.role == 'Владелец'){
                stundents = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE role = "Ученик"`))
            }
            else if(req.user.role == 'Педагог'){   
                
                const lessons = await parse(await request(`SELECT * FROM lessons_user WHERE user_id = "${req.user.id}"`))

                const lesson_user = []

                await Promise.all(lessons.map(async (lesson,index)=>{
                    const users = await parse(await request(`SELECT * FROM lessons_user WHERE lesson_id = "${lesson.lesson_id}" AND role = "Ученик"`))
                    lesson_user.push(users)
                }))

                const sortedUsers = []

                await Promise.all(lesson_user.map(async (lesson,index)=>{
                    await Promise.all(lesson.map(async (l,index)=>{
                        if(l.user_id != req.user.id){
                            sortedUsers.push(l)
                        }
                    }))
                }))
                await Promise.all(sortedUsers.map(async (user,index)=>{
                    stundents.push(await parse(await request(`SELECT user_id,name,gender,role,avatar FROM users WHERE user_id = "${user.user_id}"`))[0])
                }))

            }


            return res.status(200).json({stundents: uab(stundents),role: req.user.role})
        }
        catch(err){
            console.log(err)
        }
    }

    async getLessons(req,res) {
        try{

            let lessonsDB = []

            if(req.user.role == 'Владелец'){
                lessonsDB = await parse(await request(`SELECT * FROM lessons ${req.query.name && `WHERE lesson_name LIKE "%${req.query.name}%"`}`))

                await Promise.all(lessonsDB.map(async (lesson,index)=>{
                    const users = parse(await request(`SELECT * FROM lessons_user WHERE lesson_id = "${lesson.lesson_id}"`))
                    const status = parse(await request(`SELECT * FROM statuses WHERE id = "${lesson.lesson_status}"`))[0]
                    lessonsDB[index].students = users.filter(user=>user.role === 'Ученик').length
                    lessonsDB[index].lesson_status = status
                }))
    
            }
            else if(req.user.role == 'Педагог'){   
                
                const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE user_id = "${req.user.id}"`))


                await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                    const lesson = await parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${lesson_user.lesson_id}"`))[0]
                    lessonsDB.push(lesson)
                }))

                lessonsDB = req.query.name ? lessonsDB.filter(lesson =>{
                    return lesson.lesson_name.toLowerCase().includes(req.query.name.toLowerCase())
                }) : lessonsDB

                await Promise.all(lessonsDB.map(async (lesson,index)=>{
                    const users = parse(await request(`SELECT * FROM lessons_user WHERE lesson_id = "${lesson.lesson_id}"`))
                    const status = parse(await request(`SELECT * FROM statuses WHERE id = "${lesson.lesson_status}"`))[0]
                    lessonsDB[index].students = users.filter(user=>user.role === 'Ученик').length
                    lessonsDB[index].lesson_status = status
                }))
    
            }
           
            const statuses = await parse(await request(`SELECT * FROM statuses`))
            const lessons_type = await parse(await request(`SELECT * FROM lessons_type`))
           
            return res.status(200).json({lessons: lessonsDB,statuses,lessons_type,role: req.user.role})
        }
        catch(err){
            console.log(err)
        }
    }

    async getStatuses(req,res) {
        try{
            const statuses = await parse(await request(`SELECT * FROM statuses`))
            const statuses_visits = await parse(await request(`SELECT * FROM statuses_visits`))
            return res.status(200).json({statuses,statuses_visits,role: req.user.role})
        }
        catch(err){
            console.log(err)
        }
    }

    async getTeachers(req,res) {
        try{
            const teachers = await parse(await request(`SELECT * FROM users WHERE role = "${'Педагог'}"`))
            return res.status(200).json({teachers,role: req.user.role})
        }
        catch(err){
            console.log()
        }
    }

    //

    async getStudentLessons(req,res){
        try{

            const user = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role,avatar FROM users WHERE user_id = "${req.query.user_id}"`))[0]

            if(!user){
                return res.status(404).json({mes: 'Пользоатель не найден',role: req.user.role})  
            }

            if(user.role != 'Ученик'){
                return res.status(404).json({role: req.user.role})
            }

            const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE user_id ="${req.query.user_id}" AND role = "Ученик"`))
            
            if(!lessons_user.length){
                return res.status(200).json({lessons: [],student: user,role: req.user.role})
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

            return res.status(200).json({student: user,lessons,role: req.user.role})
        }
        catch(err){
            console.log(err)
        }
    }
    
    async getStudentSchedule(req,res){
        try{
            const {user_id} = req.query

            const user = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role,avatar FROM users WHERE user_id = "${user_id}"`))[0]
            
            if(!user){
                return res.status(404).json({mes: 'User not found',role: req.user.role})
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
                student: user,
                role: req.user.role
            })
        }
        catch(err){
            console.log(err)
        }
    }

    async getTeacherSchedule(req,res){
        try{
            const {user_id} = req.query

            const user = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role,avatar FROM users WHERE user_id = "${user_id}"`))[0]
            
            if(!user){
                return res.status(404).json({mes: 'User not found',role: req.user.role})
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
                teacher: user,
                role: req.user.role
            })
        }
        catch(err){
            console.log(err)
        }
    }

    async getTeacherLessons(req,res){
        try{

            const user = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role,avatar FROM users WHERE user_id = "${req.query.user_id}"`))[0]

            if(!user){
                return res.status(404).json({mes: 'Пользоатель не найден',role: req.user.role})  
            }

            if(user.role != 'Педагог'){
                return res.status(404).json({role: req.user.role})
            }

            const lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE user_id ="${req.query.user_id}" AND role = "Педагог"`))
            
            if(!lessons_user.length){
                return res.status(200).json({lessons: [],teacher: user,role: req.user.role})
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

            return res.status(200).json({teacher: user,lessons,role: req.user.role})
        }
        catch(err){
            console.log(err)
        }
    }

    async getLessonParticipants(req,res){
            const lesson = await parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${req.query.lesson_id}"`))[0]

            if(!lesson){
                return res.status(404).json({mes: 'Занятие не найдено',role: req.user.role})  
            }

            let lessons_user = await parse(await request(`SELECT * FROM lessons_user WHERE lesson_id ="${req.query.lesson_id}"`))
            
            if(!lessons_user.find(lesson_user=>lesson_user.user_id == req.user.id) && (req.user.role == 'Педагог' || req.user.role == 'Ученик')){
                return res.status(404).json({participants: [],lesson,role: req.user.role})
            }

            if(!lessons_user.length){
                return res.status(200).json({participants: [],lesson,role: req.user.role})
            }

            const participants = []

            await Promise.all(lessons_user.map(async (lesson_user,index)=>{
                const participant = parse(await request(`SELECT user_id,balance,name,gender,phone,email,role FROM users WHERE user_id = "${lesson_user.user_id}"`))[0]
                participants.push(participant)
            }))
            console.log(participants)

            return res.status(200).json({participants,lesson,role: req.user.role})
    }

    async getChats(req,res){
        try{
            const chat_roster = await parse(await request(`SELECT * FROM chat_roster WHERE user_id = "${req.user.id}"`))

            const chats = []

            await Promise.all(chat_roster.map(async (chat,index)=>{
                const res = parse(await request(`SELECT * FROM chat WHERE chat_id = "${chat.chat_id}"`))[0]
                chats.push(res)
            }))

            await Promise.all(chats.map(async (chat,index)=>{
                const lastMessage = parse(await request(`SELECT * FROM chat_messages WHERE chat_id = "${chat.chat_id}" ORDER BY message_date DESC LIMIT 1`))[0]
                if(lastMessage){
                    const user = parse(await request(`SELECT user_id,balance,name,gender,phone,email,role,avatar FROM users WHERE user_id = "${lastMessage.user_id}"`))[0]

                    lastMessage.name = user.name
                    lastMessage.avatar = user.avatar
                    chats[index].lastMessage = lastMessage
                }
            }))

            return res.status(200).json({chats,role: req.user.role,user_id: req.user.id})
        }
        catch(err){
            console.log(err)
        }
    }

    async getChat(req,res){
        try{

            const chat = await parse(await request(`SELECT * FROM chat WHERE chat_id = "${req.query.chat_id}"`))[0]
            
            if(!chat){

                return res.status(404).json({})
            }

            const users = []

            const chat_roster = await parse(await request(`SELECT * FROM chat_roster WHERE chat_id = "${chat.chat_id}"`))

            const check_roster = chat_roster.find(user=>user.user_id === req.user.id)

            if(!check_roster){
                console.log(21)
                return res.status(404).json({})
            }

            await Promise.all(chat_roster.map(async (user_roster,index)=>{
                const user = await parse(await request(`SELECT user_id,name,gender,role,avatar FROM users WHERE user_id = "${user_roster.user_id}"`))[0]
                users.push(user)
            }))

            const messages = parse(await request(`SELECT * FROM chat_messages WHERE chat_id = "${chat.chat_id}" ORDER BY message_date LIMIT 50`))
            
            await Promise.all(messages.map(async (message,index)=>{
                const user = parse(await request(`SELECT user_id,name,gender,role,avatar FROM users WHERE user_id = "${message.user_id}"`))[0]

                if(user){
                    messages[index].name = user.name
                    messages[index].avatar = user.avatar
                    messages[index].gender = user.gender
                    messages[index].role = user.role
                }
            }))

           chat.messages = messages

            return res.status(200).json({chat,user_id: req.user.id,users})
        }
        catch(err){
            console.log(err)
        }
    }
    
    async getUsersForChat(req,res){
        try{
            let users = []

            if(req.user.role == 'Владелец'){
                users = await parse(await request(`SELECT user_id,name,gender,role,avatar FROM users WHERE user_id != "${req.user.id}"`))
            }
            else if(req.user.role == 'Педагог'){
                const lessons = await parse(await request(`SELECT * FROM lessons_user WHERE user_id = "${req.user.id}"`))

                const lesson_user = []

                await Promise.all(lessons.map(async (lesson,index)=>{
                    const users = await parse(await request(`SELECT * FROM lessons_user WHERE lesson_id = "${lesson.lesson_id}"`))
                    lesson_user.push(users)
                }))

                const sortedUsers = []

                await Promise.all(lesson_user.map(async (lesson,index)=>{
                    await Promise.all(lesson.map(async (l,index)=>{
                        if(l.user_id != req.user.id){
                            sortedUsers.push(l)
                        }
                    }))
                }))
                await Promise.all(sortedUsers.map(async (user,index)=>{
                    users.push(await parse(await request(`SELECT user_id,name,gender,role,avatar FROM users WHERE user_id = "${user.user_id}"`))[0])
                }))

            }


            return res.status(200).json({
                users: uab(users).map((user)=>{
                    return {
                        value: user.user_id,
                        label: user.name,
                        name: user.name,
                        user_id: user.user_id,
                        avatar: user.avatar
                    }
                })
            })
        }
        catch(err){
            console.log(err)
        }
    }

}

module.exports = new PagesController()