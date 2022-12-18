const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const AdmZip = require("adm-zip");


module.exports = (app) =>{

    const io = app.get('socketio')

    io.on('connection', async (socket)=>{


        let user_id


        socket.on('onJoin',async (mes)=>{
            try{
                user_id = mes.user_id
                const groups = await parse(await request(`SELECT group_id FROM chat_roster WHERE user_id = "${mes.user_id}"`))
            
                const groupsForJoin = Array.from(groups, ({group_id}) => group_id);
                
                socket.join(groupsForJoin)


            }
            catch(err){
                console.log(err)
            }
        })


        socket.on('sendMessage',async (mes)=>{
            try{
                let mimeFile = mime.getExtension(mes.file_type)

                const files = ['jpg','jpeg','png']

                let pathImage = ''

                if(files.includes(mimeFile)){
                    const name = Math.random()*100000000000000000;
                    const stream = await fs.createWriteStream(path.join(__dirname,"../public/chat/" + name + "."+mimeFile))
                    
                    pathImage = `/static/chat/${name}.${mimeFile}`
                      
                    stream.write(Buffer.from(mes.file['0']), 'utf-8');
                    stream.end();
                }
                else{
                    
                }


                const user = await parse(await request(`SELECT * FROM users WHERE user_id = "${user_id}"`))[0]

                if(!user) return

                const chat = await parse(await request(`SELECT * FROM chat WHERE chat_id = "${mes.chat_id}"`))[0]

                if(!chat) return

                const chat_roster = await parse(await request(`SELECT * FROM chat_roster WHERE chat_id = "${mes.chat_id}" AND user_id = "${mes.user_id}"`))[0]
            
                if(!chat_roster.group_id) return

                const message_id = shortid.generate()

                const message_date = Date.now()

                const sendMessage = "INSERT INTO `chat_messages` (`message_id`,`message_date`,`message_text`,`message_image`,`group_id`,`user_id`,`chat_id`) VALUES('" + message_id + "','" + message_date + "','"+ mes.message_text +"','"+ pathImage +"','"+ chat_roster.group_id +"','"+ user_id +"','"+ chat.chat_id +"')"

                await parse(await request(sendMessage))

                return io.to(chat_roster.group_id).emit('getMessage',{
                    user_id:user.user_id,
                    avatar: user.avatar,
                    gender: user.gender,
                    role: user.role,
                    name: user.name,
                    group_id: chat_roster.group_id,
                    message_date,
                    message_id,
                    message_text: mes.message_text,
                    message_image: pathImage,
                    chat_id: chat.chat_id
                })
            }
            catch(err){
                console.log(err)
            }
        })

        socket.on('deleteMessage',async (mes)=>{
            try{
                const user = await parse(await request(`SELECT * FROM users WHERE user_id = "${user_id}"`))[0]

                if(!user) return

                const chat = await parse(await request(`SELECT * FROM chat WHERE chat_id = "${mes.chat_id}"`))[0]

                if(!chat) return

                const chat_roster = await parse(await request(`SELECT * FROM chat_roster WHERE chat_id = "${mes.chat_id}" AND user_id = "${user.user_id}"`))[0]
            
                if(!chat_roster.group_id) return

                await parse(await request(`DELETE FROM chat_messages WHERE message_id = "${mes.message_id}"`))


                const lastMessage = await parse(await request(`SELECT * FROM chat_messages WHERE chat_id = "${mes.chat_id}" ORDER BY message_date DESC LIMIT 1`))[0] || {}

                
                if(lastMessage.message_id){
                    const user = await parse(await request(`SELECT user_id,balance,name,gender,phone,email,role,avatar FROM users WHERE user_id = "${lastMessage.user_id}"`))[0]

                    lastMessage.name = user.name
                    lastMessage.avatar = user.avatar
                }


                return io.to(chat_roster.group_id).emit('deletedMessage',{
                    message_id: mes.message_id, chat_id: mes.chat_id,lastMessage
                })
            }
            catch(err){
                console.log(err)
            }
        })

    })
}