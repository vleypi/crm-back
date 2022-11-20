const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')

class LessonsController {

    async setLessons(req,res){
        try{
            const {lesson_name,lesson_color,lesson_type,lesson_teachers,lesson_students} = req.body


            const lesson_id = shortid.generate()

            await parse(await request("INSERT INTO `lessons` (`lesson_id`,`lesson_name`,`lesson_color`,`lesson_status`,`lesson_type`) VALUES('" + lesson_id + "','" + lesson_name + "','" + lesson_color + "','" + 1 + "','" + lesson_type +"')")) 

            lesson_students.map(async (student)=>{
                await parse(await request("INSERT INTO `lessons_user` (`lesson_id`, `user_id`,`role`) VALUES('"+ lesson_id +"','"+ student.user_id +"','"+ student.role +"')"))
            })
            
            
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
                        value: student.name,
                        label: student.name,
                        name: student.name,
                        user_id: student.user_id,
                        role: student.role
                    }
                }),
                teachers:teachers.map((teacher)=>{
                    return {
                        value: teacher.name,
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