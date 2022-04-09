const { mongoose } = require('../config/db')
const { Schema } = mongoose

const UsersSchema = new Schema({
    username: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    pic: String,
    role:{type:Number,default:0},
    idCustomer:String
})

UsersSchema.pre('deleteOne',function(next){
    const userId = this.getQuery()['_id']
    mongoose.model('carts').deleteOne({idUser:userId},next)
})


const UserModel = mongoose.model('users',UsersSchema)

module.exports = UserModel