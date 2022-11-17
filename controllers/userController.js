const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')


class UserController {
    async auth(req,res){
        try{
            const id = req.user.id
            const user = await parse(await request(`SELECT user_id,name,surname,email,phone FROM users WHERE user_id = "${id}"`))[0]
        
            if(!user){
                return res.status(400).json({message: 'bad req'})
            }

            return res.status(200).json({user})
            console.log(user)
        }
        catch(err){
            return res.status(400).json({message: 'Bad request'})
        }
    }

    async refresh(req,res) {
        try{
            const {ref} = req.cookies

            if(!ref){
                return res.status(401).json({message: 'UnauthorizedRefresh'})
            }
            
            const userData = jwt.verify(ref,process.env.REFRESHKEY)
            const findDb = await parse(await request(`SELECT * FROM tokens WHERE refreshToken = "${ref}"`))

            if(!userData || !findDb){
                return res.status(401).json({message: 'UnauthorizedRefresh'})
            }

            const token = jwt.sign({id: userData.id},process.env.SECRETKEY,{expiresIn: '30m'})
            const refreshToken = jwt.sign({id: userData.id},process.env.REFRESHKEY,{expiresIn: '30d'})
        
            const tokenData = await parse(await request(`SELECT * FROM tokens WHERE user_id = "${userData.id}"`))[0]

            if(tokenData){
                await parse(await request(`UPDATE tokens SET refreshToken = "${refreshToken}" WHERE user_id = "${userData.id}"`))
            } 
            else{
                parse(await request("INSERT INTO `tokens` (`token_id`,`user_id`,`refreshToken`) VALUES('" + shortid.generate() + "','" + userData.id + "','" + refreshToken + "')")) 
            }

            res.cookie('acc',token, {maxAge: 900000, httpOnly: true})
            res.cookie('ref',refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            
            return res.status(200).json({acc: token, ref: refreshToken})

        }
        catch(err){
            console.log(err)
            return res.status(401).json({message: 'UnauthorizedRefresh'})
        }
    }
}

module.exports = new UserController()