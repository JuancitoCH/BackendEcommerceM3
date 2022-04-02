const express = require('express')
const UserService = require('../services/users')
const {isAdmin} = require('../middlewares/auth')

const userRoutes =(app)=>{
    const router = express.Router()
    app.use('/admin/users',router)

    const userService = new UserService()

    router.get('/',isAdmin,async (req,res)=>{
        const users= await userService.getAllUsers()
        return res.json(users)
    })

    router.post('/update/user/role',isAdmin,async (req,res)=>{
        const users= await userService.updateUserbyId(req.body.idUser,{role:req.body.role})
        return res.json(users)
    })

    router.delete('/delete',isAdmin,async(req,res)=>{
        const {idUser} = req.body
        const users= await userService.deleteUserById(idUser)
        return res.json(users)
    })
}
module.exports = userRoutes