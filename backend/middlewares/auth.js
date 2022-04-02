const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../config/envVars')

const Permisos=(rol,req,res,next)=>{
    try{
        const {token} = req.cookies
        if(!token)  return res.json({success:false,message:"A Session is Required"})
        const userData = jwt.verify(token,jwt_secret)
        if(userData.rol<rol) return res.json({success:false,message:"you don't have permissions"})
        req.userData = userData
        next()
    }
    catch(e){
        console.log(e.message)
        return res.status(403).json({success:false,message:e.message})
    }
}
const isAdmin=(req,res,next)=>{
    const rol = 10
    Permisos(rol,req,res,next)
}
const isUser=(req,res,next)=>{
    const rol = 0
    Permisos(rol,req,res,next)
}
const isEditorPage=(req,res,next)=>{
    const rol = 5
    Permisos(rol,req,res,next)
}

module.exports = {isAdmin,isUser,isEditorPage}