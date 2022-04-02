const Users = require('./users')
const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../config/envVars')
const bcrypt = require('bcrypt')
class Auth{
    constructor(){
        this.userService = new Users()
    }
    async registerUser(data){
        const {email,password} = data
        if(!email) return {success:false,message:"Email must be included"}
        const userEmailExist = await this.userService.getUserbyEmail(email)
        if(userEmailExist) return {success:false,message:"User Alredy Exist"}

        if(password) data.password = await this.cryptPassword(password)
        const userRegistered =await this.userService.createUser(data)
        if(userRegistered.success === false) return userRegistered
        
        return this.getToken(userRegistered,"Register")
    }

    async loginUser({email,password}){
        if(!email || !password) return {success:false,message:"You must include Credentials"}
        const user = await this.userService.getUserbyEmail(email)
        if(!user) return {success:false,message:"User not Register"}

        const passwordCompare = await bcrypt.compare(password,user.password)
        if(!passwordCompare) return {success:false,message:"Incorrect Password"}

        const token = this.getToken(user,"login")
        return token
    }




    async cryptPassword(password){
        const salt = await bcrypt.genSalt(10)
        const cryptPassword = await bcrypt.hash(password,salt)
        return cryptPassword
    }


    getToken(userData,message="",time="7d"){
        const user = {
            id:userData._id,
            username:userData.username,
            password:userData.password,
            pic:userData.pic,
            role:userData.role,
            email:userData.email
        }
        const token = jwt.sign(user,jwt_secret,{expiresIn:time})
        delete user.password
        return {success:true,token,user,message:"Succefully " + message}
    }
}

module.exports = Auth