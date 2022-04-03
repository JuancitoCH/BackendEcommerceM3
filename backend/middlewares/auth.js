const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../config/envVars')

const Permisos=(role,req,res,next)=>{
    try{
        const {token} = req.cookies
        if(!token)  return res.json({success:false,message:"A Session is Required"})
        const userData = jwt.verify(token,jwt_secret)
        if(userData.role<role) return res.json({success:false,message:"you don't have permissions"})
        req.userData = userData
        next()
    }
    catch(e){
        console.log(e.message)
        return res.status(403).json({success:false,message:e.message})
    }
}
const isAdmin=(req,res,next)=>{
    const role = 10
    Permisos(role,req,res,next)
}
const isUser=(req,res,next)=>{
    const role = 0
    Permisos(role,req,res,next)
}
const isEditorPage=(req,res,next)=>{
    const role = 5
    Permisos(role,req,res,next)
}

module.exports = {isAdmin,isUser,isEditorPage}