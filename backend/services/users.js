const validateCreate = require('../helpers/validateErrors')
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
        const validate = validateCreate(User)
        if(validate.error) return { ...validate }
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
    
}
module.exports = userService