const express = require('express')
const Auth = require('../services/auth')
const cookieResponse = require('../libs/cookieResponse')
const {isUser} = require('../middlewares/auth')
const authRoutes =(app)=>{
    const router = express.Router()
    app.use('/user/service',router)

    const authService = new Auth()

    router.post('/register',async(req,res)=>{
        const responseObject = await authService.registerUser(req.body)
        return cookieResponse(res,responseObject)
    })
    router.post('/login',async(req,res)=>{
        const responseObject = await authService.loginUser(req.body)
        return cookieResponse(res,responseObject)
    })
    router.get('/logout',async(req,res)=>{
        return cookieResponse(res,'')
    })
    router.get('/login/validate',isUser,async(req,res)=>{
        return res.json({success:true,user:{
            id:req.userData.id,
            username:req.userData.username,
            email:req.userData.email,
            role:req.userData.role,
        }
        })
    })

    
}
module.exports = authRoutes