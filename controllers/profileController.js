const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')
const path = require('path')

class ProfileController {

    async setAvatar(req,res) {
        try{
            const { image } = req.files;

            
            if (!image) return res.sendStatus(400);

            const name = Math.random()*100000000000000000;

            await image.mv(path.join(__dirname,"../public/blog/" + name + ".png"));

            await parse(await request(`UPDATE users SET avatar = "/static/blog/${name}.png" WHERE user_id = "${req.user.id}"`))
            
            return res.status(200).json({
                "imagePath": `/static/blog/${name}.png`
            });
        }
        catch(err){
            console.log(err)
            return res.status(400).json({message: 'Bad request'})
        }
    }


    async setName(req,res) {
        try{
            const validate = validationResult(req)

            if(!validate.isEmpty()){
                return res.status(400).json({mes: validate.errors[0].msg})
            }

            const { name } = req.body;
            
            if (!name) return res.sendStatus(400);

            await parse(await request(`UPDATE users SET name = "${name}" WHERE user_id = "${req.user.id}"`))
            
            return res.status(200).json({
                name
            });
        }
        catch(err){
            return res.status(400).json({message: 'Bad request'})
        }
    }

    async setPassword(req,res) {
        try{
            const validate = validationResult(req)

            if(!validate.isEmpty()){
                return res.status(400).json({mes: validate.errors[0].msg})
            }

            const { oldPassword,newPassword } = req.body;

            const user = await parse(await request(`SELECT * FROM users WHERE user_id = "${req.user.id}"`))[0]

            const hashPassword = await bcrypt.compare(oldPassword,user.password)

            if(!hashPassword){
                return res.status(400).json({mes: 'Неправильный логин или пароль'})
            }

            const newHashedPassword = await bcrypt.hash(newPassword,7)

            await parse(await request(`UPDATE users SET password = "${newHashedPassword}" WHERE user_id = "${req.user.id}"`))
          
            return res.status(200).json({});
        }
        catch(err){
            return res.status(400).json({message: 'Bad request'})
        }
    }


}

module.exports = new ProfileController()