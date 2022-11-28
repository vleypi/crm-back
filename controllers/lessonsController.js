const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')

class LessonsController {

    async setLessons(req,res){
        try{
            const validate = validationResult(req)

            if(!validate.isEmpty()){
                return res.status(400).json({mes: validate.errors[0].msg})
            }
            
            const {lesson_id,lesson_name,lesson_color,lesson_type,lesson_teachers,lesson_students,lesson_status=1} = req.body

           if(!lesson_id){
                const lesson_id = shortid.generate()

                await parse(await request("INSERT INTO `lessons` (`lesson_id`,`lesson_name`,`lesson_color`,`lesson_status`,`lesson_type`) VALUES('" + lesson_id + "','" + lesson_name + "','" + lesson_color + "','" + 1 + "','" + lesson_type +"')")) 

                if(lesson_students.length){
                    lesson_students.map(async (student)=>{
                        await parse(await request("INSERT INTO `lessons_user` (`lesson_id`, `user_id`,`role`) VALUES('"+ lesson_id +"','"+ student.user_id +"','"+ student.role +"')"))
                    })
                }
                
                if(lesson_teachers.length){
                    lesson_teachers.map(async (teacher)=>{
                        await parse(await request("INSERT INTO `lessons_user` (`lesson_id`, `user_id`,`role`) VALUES('"+ lesson_id +"','"+ teacher.user_id +"','"+ teacher.role +"')"))
                    })
                }
           }
           else{
                await parse(await request(`
                    UPDATE lessons
                    SET lesson_color = "${lesson_color}",
                        lesson_name = "${lesson_name}",
                        lesson_status = "${lesson_status}",
                        lesson_type = "${lesson_type}"
                    WHERE lesson_id = "${lesson_id}"
                `)) 
           }

            return res.status(200).json({})
        }   
        catch(err){
            console.log(err)
        }
    }

    async getStudentsTeachers(req,res){
        try{

            const students = await parse(await request(`SELECT user_id,name,role FROM users WHERE role = "Ученик"`))
            const teachers = await parse(await request(`SELECT user_id,name,role FROM users WHERE role = "Педагог"`))

            res.status(200).json({
                students:students.map((student)=>{
                    return {
                        value: student.user_id,
                        label: student.name,
                        name: student.name,
                        user_id: student.user_id,
                        role: student.role
                    }
                }),
                teachers:teachers.map((teacher)=>{
                    return {
                        value: teacher.user_id,
                        label: teacher.name,
                        name: teacher.name,
                        user_id: teacher.user_id,
                        role: teacher.role
                    }
                })
        })
        }   
        catch(err){
            console.log(err)
        }
    }
}

module.exports = new LessonsController()