const UserModel = require('../models/users')

class userService {

    async getAllUsers() {
        return await UserModel.find()
    }

    async getUserId(id) {
        return await UserModel.findById(id)
    }
    async getUserbyEmail(email) {
        return await UserModel.findOne({ email })
    }

    async createUser(data) {
        delete data.role
        const User = new UserModel(data)
        const validate = this.validateUser(User)
        if(validate.error) return {validate,success:false}
        const userCreate =await User.save()
        return {...userCreate._doc,success:true}
    }

    
    async updateUserbyId(id, data) {
        return await UserModel.findByIdAndUpdate(id, data, { new: true })
    }

    async updateUserbyEmail(email, data) {
        return await UserModel.findOneAndUpdate({ email }, data, { new: true })
    }
    
    async deleteUserById(id) {
        
        return await UserModel.findByIdAndDelete(id)
    }
    


    validateUser(user) {
        const res = user.validateSync()
        if (res) {
            const errors = Object.keys(res.errors).map(path => {
                return (`Error in '${path}' : it must '${res.errors[path].kind}' and the value '${res.errors[path].value}' not match the conditions`)
            })
            return { errors, error: true }
        }
        return { error: false }
    }
}
module.exports = userService