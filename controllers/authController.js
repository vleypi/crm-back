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

            console.log(req.body)
            const emailCheck = await parse(await request(`SELECT * FROM users WHERE email = "${email}"`))

            if(!emailCheck.length){
                return res.status(405).json({
                    mes: 'Неверный логин или пароль'
                })
            }


            const hashPassword = await bcrypt.compare(password,emailCheck[0].password)

            if(!hashPassword){
                return res.status(400).json({message: 'Неправильный логин или пароль'})
            }

            const token = jwt.sign({id: emailCheck[0].user_id,role: emailCheck[0].role},process.env.SECRETKEY,{expiresIn: '30d'})
            const refreshToken = jwt.sign({id: emailCheck[0].user_id,role: emailCheck[0].role},process.env.REFRESHKEY,{expiresIn: '30d'})

            const tokenData = parse(await request(`SELECT * FROM tokens WHERE user_id = "${emailCheck[0].user_id}"`))

            if(tokenData[0]){
                request(`UPDATE tokens SET refreshToken = "${refreshToken}" where user_id ="${emailCheck[0].user_id}"`)
                res.cookie('ref',tokenData[0].refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            }
            else{
                parse(await request("INSERT INTO `tokens` (`token_id`,`user_id`,`refreshToken`) VALUES('" + shortid.generate() + "','" + emailCheck[0].user_id + "','" + refreshToken + "')")) 
                res.cookie('ref',refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            }

            res.cookie('acc',token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

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

    async setUser(req,res,next) {
        try{
            
            const validate = validationResult(req)

            if(!validate.isEmpty()){
                return res.status(400).json({mes: validate.errors[0].msg})
            }


            const {password,name,user_id,email,phone,role,gender} = req.body

            
            

            if(!user_id){
                const hashedPassword = await bcrypt.hash(password,7)

                const emailCheck = await request(`SELECT * FROM users WHERE email = "${email}"`)


                if(parse(emailCheck).length){
                    return res.status(405).json({
                        mes: 'Этот email уже существует'
                    })
                }

                const id = shortid.generate()

                const userAdd = "INSERT INTO `users` (`user_id`,`name`,`phone`,`email`,`password`,`gender`,`role`,`balance`) VALUES('" + id + "','" + name + "','"+ phone +"','"+ email +"','"+ hashedPassword +"','"+ gender +"','" + role +"','"+ 0 +"')"

                parse(await request(userAdd))

                return res.status(200).json({})
            }

           
            
            const user = await parse(await request(`SELECT * FROM users WHERE user_id ="${user_id}"`))[0]

            const newPassword = password ? await bcrypt.hash(password,7) : user.password
    
            if(user){
                await parse(await request(`
                    UPDATE users 
                    SET name = "${name}",
                        password = "${password}",
                        email = "${email}",
                        phone = "${phone}",
                        gender = "${gender}",
                        password = "${newPassword}"
                    WHERE user_id ="${user_id}"`
                ))
            }
            
            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
        }
    }

    async logout(req,res) {
        try{

            await parse(await request(`DELETE FROM tokens WHERE user_id = "${req.user.id}"`))

            res.cookie('acc','', {maxAge: -1, httpOnly: true})
            res.cookie('ref','', {maxAge: -1, httpOnly: true})

            return res.status(200).json({})
        }
        catch(err){
            res.cookie('acc','', {maxAge: -1, httpOnly: true})
            res.cookie('ref','', {maxAge: -1, httpOnly: true})
            
            return res.status(200).json({})
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