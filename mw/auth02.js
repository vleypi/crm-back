const jwt = require('jsonwebtoken')

module.exports = (req,res,next) =>{
    if(req.method === "OPTIONS"){
        next()
    }

    try{
        
        // const token = req.body.acc ? req.body.acc : req.body.data.acc
        const refresh = req.body.ref ? req.body.ref : ''
        console.log('from client')
        if(!refresh){
            return res.status(401).json({message: 'UnauthorizedToken'})
        }
        const decoded = jwt.verify(refresh,process.env.REFRESHKEY)
        req.user = decoded
        next()
    }
    catch(err){
        console.log(err)
        return res.status(403).json({mes: 'auth error'})
    }
}