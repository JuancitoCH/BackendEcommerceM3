const { mongoose } = require('../config/db')
const { Schema } = mongoose

const CartSchema = new Schema({

    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    products: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity:{type:Number}

        }]
})

const CartModel = mongoose.model('carts', CartSchema)

module.exports = CartModel