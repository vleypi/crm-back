const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')
const path = require("path");

class ChatController {

    async createChat(req,res){
        try{
            const {chat_roster,chat_name} = req.body

            const chat_id = shortid.generate()
                
            await parse(await request("INSERT INTO `chat` (`chat_id`,`chat_name`,`chat_author`) VALUES('" + chat_id + "','" + chat_name + "','" + req.user.id + "')")) 

            await parse(await request("INSERT INTO `chat_roster` (`chat_id`,`user_id`,`group_id`) VALUES('" + chat_id + "','" + req.user.id + "','" + chat_id + "')")) 

            await Promise.all(chat_roster.map(async (user,index)=>{
                await parse(await request("INSERT INTO `chat_roster` (`chat_id`,`user_id`,`group_id`) VALUES('" + chat_id + "','" + user.user_id + "','" + chat_id + "')")) 
            }))

            
            return res.status(200).json({chat_id})
        }
        catch(err){
            console.log(err)
            return res.status(400).json({mes: 'Bad request'})
        }
    }

    async saveChat(req,res){
        try{
            const {chat_roster,chat_name,chat_id,user_id} = req.body

            const chat = await parse(await request(`SELECT * FROM chat WHERE chat_id = "${chat_id}"`))

            if(!chat) return res.status(404).json({})

            const roster = await parse(await request(`SELECT * FROM chat_roster WHERE chat_id = "${chat_id}"`)).map((user)=>{
                return user.user_id
            })


            const chat_roster_arr = chat_roster.map((user)=>{
                return user.user_id
            })

            chat_roster_arr.push(user_id)

            Array.prototype.diff = function(a) {
                return this.filter(function(i){return a.indexOf(i) < 0;});
            };
            
            const deleted = roster.diff(chat_roster_arr);
            const added = chat_roster_arr.diff(roster);

            if(deleted.length){
                await Promise.all(deleted.map(async (user,index)=>{
                    await parse(await request(`DELETE FROM chat_roster WHERE user_id = "${user}" AND chat_id = "${chat_id}"`))
                }))
            }

            if(added.length){
                await Promise.all(added.map(async (user,index)=>{
                    await parse(await request("INSERT INTO `chat_roster` (`chat_id`,`user_id`,`group_id`) VALUES('" + chat_id + "','" + user + "','" + chat_id + "')")) 
                }))
            }

            if(chat_name){
                await parse(await request(`UPDATE chat SET chat_name = "${chat_name}" WHERE chat_id = "${chat_id}"`))
            }
            
            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
            return res.status(400).json({mes: 'Bad request'})
        }
    }

}

module.exports = new ChatController()