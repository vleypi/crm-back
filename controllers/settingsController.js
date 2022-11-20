const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')

class SettingsController {
    async changePassword(req,res){
        try{
            const validate = validationResult(req)

            if(!validate.isEmpty()){
                return res.status(400).json({mes: validate.errors[0].msg})
            }

            const {password, newPassword} = req.body
            

            const user = parse(await request(`SELECT * from users WHERE user_id = "${req.user.id}"`))[0]

            if(!user){
                return res.status(404).json({})
            }

            const unhashPassword = await bcrypt.compare(password,user.password)

            if(!unhashPassword){
                return res.status(400).json({message: 'Неправильный пароль'})
            }

            const newHashedPassword = await bcrypt.hash(newPassword,7)

            const changePassword = parse(await request(`UPDATE users SET password = "${newHashedPassword}" WHERE user_id ="${user.user_id}"`))

            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
        }
    }

    async changeMainData(req,res){
        try{
            const {name} = req.body

            if(!name){
                return res.status(400).json({mes: 'Что-то пошло не так'})
            }

            const changeName = parse(await request(`UPDATE users SET name = "${name}" WHERE user_id ="${req.user.id}"`))
            
            return res.status(200).json({name})
        }
        catch(err){
            return res.status(400).json({mes: 'Что-то пошло не так'})
        }
    }

    async amountPay(req,res){
        try{
            return res.status(200).json({mes: 'succsess'})
        }
        catch(err){
            console.log(err)
        }
    }

    async getAccesses(req,res){
        try{
            const accesses = parse(await request(`SELECT user_id,name,surname,email,phone,role FROM users WHERE role != "Ученик" `))

            return res.status(200).json({accesses})
        }
        catch(err){
            console.log(err)
        }
    }

    async changeAccesses(req,res){
        try{
            const {role,user_id} = req.body

            const checkRole = parse(await request(`SELECT * FROM roles WHERE role_name = "${role}"`))

            if(!checkRole[0]){
                return res.status(404).json({mes:'Нет такой роли'})
            }

            const user = parse(await request(`SELECT user_id FROM users WHERE user_id = "${user_id}"`))[0]

            if(!user){
                return res.status(404).json({mes:'Нет такого пользователя'})
            }

            const accesses = parse(await request(`UPDATE users SET role = "${checkRole[0].role_name}" WHERE user_id = "${user.user_id}" `))

            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
        }
    }

    async addAccesses(req,res){
        try{
            const {email,name,role} = req.body


        }
        catch(err){
            console.log(err)
        }
    }

    async deleteAccesses(req,res){
        try{

        }
        catch(err){
            console.log(err)
        }
    }

    async getRoles(req,res){
        try{
            const roles = parse(await request('SELECT * FROM roles'))

            return res.status(200).json({roles})
        }
        catch(err){
            console.log(err)
        }
    }

    async deleteRoles(req,res){
        try{
            const {role_name} = req.body

            const deleteRole = parse(await request(`DELETE FROM roles WHERE role_name = "${role_name}"`))

            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
        }
    }

    async addRoles(req,res){
        try{

        }
        catch(err){
            console.log(err)
        }
    }

    async changeRoles(req,res){
        try{

        }
        catch(err){
            console.log(err)
        }
    }


}

module.exports = new SettingsController()