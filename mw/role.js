const jwt = require('jsonwebtoken')
const request = require('../settings/db')
const parse = require('../settings/parse')

module.exports = (roles) =>{
    return async (req,res,next)=>{
        if(req.method === "OPTIONS"){
            next()
        }
    
        try{
            const token = req.cookies.ref || req.body.ref
            
            if(!token){
                return res.status(403).json({mes: 'Un auth'})
            } 

            const userRoles= jwt.verify(token,process.env.REFRESHKEY)

            console.log(userRoles)
            let hasRole = false

            userRoles.forEach(role=>{
                if(roles.includes(role)){
                    hasRole = true
                }
            })

            if(!hasRole){
                return res.status(403).json({mes: 'un auth 2'})
            }



            next()
        }
        catch(err){
            console.log(err)
            return res.status(403).json({mes: 'Un auth 2'})
        }
    }
}