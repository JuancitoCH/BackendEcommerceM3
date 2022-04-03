const { mongoose } = require('../config/db')
const { Schema } = mongoose

const ProductsSchema = new Schema({
    name: {type:String,required:true},
    price: {type:Number,required:true},
    stock:{type:Number},
    description:{type:Object,required:true},
    pics:[{type:String}],
    categories:[{type:String}],//hacemos un modelo para las categorias?
    
    idCreator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    idReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'reviews'
    }]
})

const ProductsModel = mongoose.model('products',ProductsSchema)

module.exports = ProductsModel