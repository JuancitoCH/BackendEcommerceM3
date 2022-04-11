const { mongoose } = require('../config/db')
const { Schema } = mongoose

const PaymentsSchema = new Schema({
    id:String,
    amount:Number,
    amount_received:Number,
    client_secret:String,
    currency:String,
    shipping:Object,
    receipt_email:String,
    description:String,
    date:Date
})


const PaymentsModel = mongoose.model('payment',PaymentsSchema)

module.exports = PaymentsModel