const express = require('express')
const Auth = require('../services/auth')
const cookieResponse = require('../libs/cookieResponse')

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

    
}
module.exports = authRoutes