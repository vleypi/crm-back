const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')


class StatusesController {
    async setStatuses(req,res){
        try{
            const {status_id,status_name,status_color,status_withdraw,status_pay,status_visited} = req.body
            
            if(!status_id){
                await parse(await request("INSERT INTO `statuses_visits` (`status_id`,`status_name`,`status_withdraw`,`status_pay`,`status_visited`,`status_color`) VALUES('" + shortid.generate() + "','" + status_name + "','" + status_withdraw + "','" + status_pay + "','" + status_visited +"','" + status_color + "')")) 
                return res.status(200).json({})
            }

            const status = await parse(await request(`SELECT * FROM statuses_visits WHERE status_id ="${status_id}"`))[0]
    
            if(status){
                await parse(await request(`
                    UPDATE statuses_visits 
                    SET status_name = "${status_name}",
                        status_color = "${status_color}",
                        status_withdraw = "${status_withdraw}", 
                        status_pay = "${status_pay}", 
                        status_visited = "${status_visited}" 
                    WHERE status_id ="${status_id}"`
                ))
            }
            
            return res.status(200).json({})
        }   
        catch(err){
            console.log(err)
        }
    }

    async deleteStatus(req,res){
        try{
            const {status_id} = req.body
            
            await parse(await request(`
                    DELETE FROM statuses_visits 
                    WHERE status_id ="${status_id}"`
            ))
            
            return res.status(200).json({})
        }   
        catch(err){
            console.log(err)
        }
    }
}

module.exports = new StatusesController()