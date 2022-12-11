const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')


class VisitsController {
    async setVisitStatus(req,res){
        try{
            const {option,student,visit_id,query} = req.body

            const visit_user = await parse(await request(`SELECT * FROM visits_users WHERE user_id = "${student.user_id}" AND lesson_id = "${query.lesson_id}" AND appointment_id = "${query.appointment_id}" AND day="${query.day}" AND year="${query.year}" AND month="${query.month}"`))[0]

            if(visit_user){
                await parse(await request(`UPDATE visits_users SET status_id = "${option.status_id}" WHERE user_id = "${student.user_id}" AND lesson_id = "${query.lesson_id}" AND appointment_id = "${query.appointment_id}" AND day="${query.day}" AND year="${query.year}" AND month="${query.month}"`))
            }
            else{
                await parse(await request("INSERT INTO `visits_users` (`appointment_id`,`lesson_id`,`user_id`,`status_id`,`day`,`month`,`year`) VALUES('" + query.appointment_id + "','" + query.lesson_id + "','" + student.user_id + "','" + option.status_id + "','" + query.day + "','" + query.month + "','" + query.year + "')")) 
            }
            
            return res.status(200).json({})
        }   
        catch(err){
            console.log(err)
        }
    }



}

module.exports = new VisitsController()