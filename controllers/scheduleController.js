const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')


class ScheduleController {

    async addAppointment(req,res){
        try{
            let {title="",rRule="",startDate="",endDate="",lesson_id="",notes="",allDay=false} = req.body.appointment

            if(!startDate || !endDate){
                return res.status(400).json({})
            }

            const startDateCheck = {
                day: new Date(startDate).getDate(),
                month: new Date(startDate).getMonth()
            }

            const endDateCheck = {
                day: new Date(endDate).getDate(),
                month: new Date(endDate).getMonth()
            }

            const lesson = await parse(await request(`SELECT * FROM lessons WHERE lesson_id = "${lesson_id}"`))

            if(rRule){
                const days = ["SU",'MO',"TU","WE","TH","FR","SA"]
                rRule = rRule+';BYDAY='+days[new Date(endDate).getDay()]
    
            }


            await parse(await request("INSERT INTO `appointments` (`id`,`rRule`,`startDate`,`endDate`,`lesson_id`,`notes`,`allDay`) VALUES('" + shortid.generate() + "','" + rRule + "','" + startDate + "','" + endDate + "','" + lesson_id + "','" + notes + "','" + allDay + "')")) 
            
            return res.status(200).json({})
        }   
        catch(err){
            console.log(err)
        }
    }

    async changeAppointment(req,res){
        try{

            Object.keys(req.body.changes).map((change,index)=>{
                if(change == "lesson_id"){
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