const jwt = require('jsonwebtoken')
const request = require('../settings/db')
const parse = require('../settings/parse')

module.exports = (permissions) =>{
    return async (req,res,next)=>{
        if(req.method === "OPTIONS"){
            next()
        }
    
        try{
            
            const userRole = parse(await request(`SELECT * FROM users WHERE user_id = "${req.user.id}"`))
            
            if(!userRole){
                return res.status(403).json({mes: 'Un auth 2'})
            }

            const checkPermissions = parse(await request(`SELECT * from roles_and_permissions WHERE role_name = "${userRole[0].role}"`))
            
            let hasPermission = false
            
            checkPermissions.forEach(permission =>{
                if(permissions.includes(permission.permission_name)){
                    hasPermission = true
                }
            })

            if(!hasPermission){
                return res.status(403).json({mes: 'Недостаточно прав'})
            }

            next()
        }
        catch(err){
            console.log(err)
            return res.status(403).json({mes: 'Un auth 2'})
        }
    }
}