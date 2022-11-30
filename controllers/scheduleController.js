const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')


class ScheduleController {
    async addAppointment(req,res){
        try{
            console.log(req.body)
            const {title="",rRule="",startDate="",endDate="",lesson_id="",notes="",allDay=false} = req.body.appointment

            if(!startDate || !endDate || !title){
                return res.status(400).json({})
            }

            await parse(await request("INSERT INTO `appointments` (`id`,`title`,`rRule`,`startDate`,`endDate`,`lesson_id`,`notes`,`allDay`) VALUES('" + shortid.generate() + "','" + title + "','" + rRule + "','" + startDate + "','" + endDate + "','" + lesson_id + "','" + notes + "','" + allDay + "')")) 
            
            return res.status(200).json({})
        }   
        catch(err){
            console.log(err)
        }
    }

    async changeAppointment(req,res){
        try{

            Object.keys(req.body.changes).map((change,index)=>{
                if(change == "title" || change == "lesson_id"){
                    if(req.body.changes[change]){
                        parse( request(`UPDATE appointments SET ${change} = "${req.body.changes[change]}" WHERE id = "${req.body.appointment_id}"`))
                    }
                }
                else{
                    parse( request(`UPDATE appointments SET ${change} = "${req.body.changes[change]}" WHERE id = "${req.body.appointment_id}"`))
                }
            })

            return res.status(200).json({})
        }   
        catch(err){
            console.log(err)
        }
    }

    async deleteAppointment(req,res){
        try{

            await parse(await request(`DELETE FROM appointments WHERE id = "${req.body.appointment_id}"`))
            
            return res.status(200).json({})
        }   
        catch(err){
            console.log(err)
        }
    }
}

module.exports = new ScheduleController()