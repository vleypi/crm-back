const jwt = require('jsonwebtoken')

module.exports = (req,res,next) =>{
    if(req.method === "OPTIONS"){
        next()
    }

    try{
        // console.log(req.cookies)
        // const token = req.headers.authorization.split(' ')[1]
        
        // if(!token){
        //     return res.status(403).json({mes: 'auth error'})
        // }

        // const decoded = jwt.verify(token,process.env.SECRETKEY)
        // req.user = decoded
        // next()

        const token = req.cookies.acc
        const refresh = req.cookies.ref

        if(!token && !refresh){
            return res.status(401).json({message: 'UnauthorizedToken'})
        }
        else if(token && !refresh){
            res.cookie('acc','', {maxAge: -1, httpOnly: true})
            res.cookie('ref','', {maxAge: -1, httpOnly: true})
            return res.status(401).json({message: 'UnauthorizedToken'})
        }
        else if(!token || !refresh){
            return res.status(401).json({message: 'Unauthorized'})
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