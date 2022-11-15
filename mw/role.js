const jwt = require('jsonwebtoken')

module.exports = (roles) =>{
    return (req,res,next)=>{
        if(req.method === "OPTIONS"){
            next()
        }
    
        try{
            const token = req.headers.authorization.split(' ')[1]
            
            if(!token){
                return res.status(403).json({mes: 'Un auth 1'})
            }
    
            const {roles: userRoles} = jwt.verify(token,process.env.SECRETKEY)
            
            next()
        }
        catch(err){
            console.log(err)
            return res.status(403).json({mes: 'Un auth 2'})
        }
    }
}