const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')

class AuthController {

    async login(req,res) {
        try{
            console.log('from client')
            const validate = validationResult(req)

            if(!validate.isEmpty()){
                return res.status(400).json({mes: validate.errors[0].msg})
            }

            const {password,email,remember} = req.body

            const emailCheck = parse(await request(`SELECT * FROM users WHERE email = "${email}"`))

            if(!emailCheck.length){
                return res.status(405).json({
                    mes: 'Такого email не существует'
                })
            }


            const hashPassword = await bcrypt.compare(password,emailCheck[0].password)

            if(!hashPassword){
                return res.status(400).json({message: 'Неправильный логин или пароль'})
            }

            const token = jwt.sign({id: emailCheck[0].user_id},process.env.SECRETKEY,{expiresIn: '30m'})
            const refreshToken = jwt.sign({id: emailCheck[0].user_id},process.env.REFRESHKEY,{expiresIn: '30d'})

            const tokenData = parse(await request(`SELECT * FROM tokens WHERE user_id = "${emailCheck[0].user_id}"`))

            if(tokenData[0]){
                request(`UPDATE tokens SET refreshToken = "${refreshToken}" where user_id ="${emailCheck[0].user_id}"`)
                res.cookie('ref',tokenData[0].refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            }
            else{
                parse(await request("INSERT INTO `tokens` (`token_id`,`user_id`,`refreshToken`) VALUES('" + shortid.generate() + "','" + emailCheck[0].user_id + "','" + refreshToken + "')")) 
                res.cookie('ref',refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            }

            res.cookie('acc',token, {maxAge: 900000, httpOnly: true})

            return res.status(200).json({
                name: emailCheck[0].name,
                surname: emailCheck[0].surname,
                email: emailCheck[0].email,
                phone: emailCheck[0].phone,
                token
            })
        }
        catch(err){
            console.log(err)
            return res.status(400).json({message: 'Bad request'})
        }
    }

    async registration(req,res,next) {
        try{
            const validate = validationResult(req)

            if(!validate.isEmpty()){
                return res.status(400).json({mes: validate.errors[0].msg})
            }


            const {password,name,surname,email,phone} = req.body

            const emailCheck = await request(`SELECT * FROM users WHERE email = "${email}"`)

            if(parse(emailCheck).length){
                return res.status(405).json({
                    mes: 'Этот email уже существует'
                })
            }

            const hashedPassword = await bcrypt.hash(password,7)

            const id = shortid.generate()

            const userAdd = "INSERT INTO `users` (`user_id`,`name`,`surname`,`phone`,`email`,`password`) VALUES('" + id + "','" + name + "','" + surname + "','"+ phone +"','" + email + "','" + hashedPassword + "')"

            parse(await request(userAdd))

            
            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
        }
    }

    async test(req,res,next) {
        try{

            console.log(req.user.id)
            
            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
        }
    }
}

module.exports = new AuthController()