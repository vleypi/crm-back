const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')


class VisitsController {
    async setVisitStatus(req,res){
        try{
            const {option,student,visit_id,lesson_id} = req.body

            const visit = await parse(await request(`SELECT * FROM visits WHERE visit_id = "${visit_id}"`))[0]

            if(!visit){
                return res.status(404).json({})
            }

            const visit_user = await parse(await request(`SELECT * FROM visits_users WHERE visit_id = "${visit_id}" AND user_id = "${student.user_id}"`))[0]

            if(visit_user){
                await parse(await request(`UPDATE visits_users SET status_id = "${option.status_id}" WHERE user_id = "${student.user_id}"`))
            }
            else{
                await parse(await request("INSERT INTO `visits_users` (`visit_id`,`user_id`,`lesson_id`,status_id) VALUES('" + visit_id + "','" + student.user_id + "','" + lesson_id + "','" + option.status_id + "')")) 
            }
            
            return res.status(200).json({})
        }   
        catch(err){
            console.log(err)
        }
    }



}

module.exports = new VisitsController()