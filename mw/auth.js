const jwt = require('jsonwebtoken')

module.exports = (req,res,next) =>{
    if(req.method === "OPTIONS"){
        next()
    }

    try{
        const token = req.headers.authorization.split(' ')[1]
        
        if(!token){
            return res.status(403).json({mes: 'auth error'})
        }

        const decoded = jwt.verify(token,process.env.SECRETKEY)
        req.user = decoded
        next()
    }
    catch(err){
        console.log(err)
        return res.status(403).json({mes: 'auth error'})
    }
}