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
        // if(!data.email) return 
        delete data.role
        data.email  = data.email.replace(/ /g,'')
        // data.email  = data.email.trim()
        data.email = data.email.toString().toLowerCase()
        const User = new UserModel(data)
        const validate = validateCreate(User)
        if(validate.error) return { ...validate }
        
        const exist = await UserModel.findOne({email:data.email})
        if(exist)return {success:false, message:'user alredy exist'}
        const userCreate =await User.save()
        return {...userCreate._doc,success:true}
    }

    
    async updateUserbyId(id, data) {
        return await UserModel.findByIdAndUpdate(id, data, { new: true })
    }

    async updateUserbyEmail(email, data) {
        return await UserModel.findOneAndUpdate({ email }, data, { new: true })
    }
    
    async deleteUserById(_id) {
        
        return await UserModel.deleteOne({_id})
    }
    // TODO: usarla al crear al costumer
    async updateUserIdCostumer(id, data) {
        return await UserModel.findByIdAndUpdate(id, {idCustomer:data}, { new: true })
    }
}
module.exports = userService