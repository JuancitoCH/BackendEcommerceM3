const { stripe_pk, stripe_sk, webhook_secret } = require('../config/envVars')
const stripe = require('stripe')(stripe_sk)
const PaymentsModel = require('../models/Payments')
const sendEmail = require('../libs/email')
const User = require('../services/users')
const Cart = require('./cart')

// const endpointSecret = "whsec_bca0b2dd09f9cdefcb2ef7915d4efc0e489ecbbc3009e74128afd2f606793d0a"
const endpointSecret = webhook_secret
class Payments {
    constructor() {
        this.userService = new User()
        this.cartService = new Cart()
    }
    async createIntent(amount, userData, name,quantity=1 ) {
        const description = `${name} x ${quantity}`
        const idCustomer  = await this.getCustomerId(userData)
        if(idCustomer){

            const intent = await stripe.paymentIntents.create({
                customer:idCustomer,
                amount: amount*quantity*100,
                currency: "usd",
                description
            })
            return intent.client_secret
        }
        return {success:false,message:"An Error has ocurre"}
    }

    async createIntentCart(userData,{products} ) {
        let amount=0
        let description
        
        if(products.length===0) return {success:false,message:"the cart dont has products"}
        products.map(product=>{
            amount+=(product._id.price * product.quantity)
            description += `  ${product._id.name} x ${product.quantity}  `
        })
        const idCustomer  = await this.getCustomerId(userData)
        if(idCustomer){

            const intent = await stripe.paymentIntents.create({
                customer:idCustomer,
                amount: Math.round(amount*100),
                currency: "usd",
                description
            })
            return intent.client_secret
        }
        return {success:false,message:"An Error has ocurre"}
    }

    async createEvent(body, sign) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, sign, endpointSecret);
            if (event.type === "payment_intent.succeeded") {
                console.log(event.data.object)
                const { id, amount, amount_received, client_secret, currency, shipping, receipt_email, description } = event.data.object
                const infoPayment = {
                    id,
                    amount,
                    amount_received,
                    client_secret,
                    currency,
                    shipping,
                    receipt_email,
                    description
                }
                await this.createPaymentHistory(infoPayment)
                await this.sendEmailPayInfo(infoPayment)
                await this.cartService.resetProductOnCart(receipt_email)
                // console.log(infoPayment)
                return { success: true }
            } else {
                return { success: true }
            }

        } catch (err) {
            return { success: false, message: `Webhook Error: ${err.message}` }

        }
    }

    async createPaymentHistory(data) {
        return await PaymentsModel.create({ ...data,date:Date.now()})
    }
    async getPayments() {
        return await PaymentsModel.find()
    }
    async sendEmailPayInfo(data) {
        await sendEmail(data.receipt_email, "Recibo Efruits", "gracias por su compra", `
        <h1>Recibo de Compra</h1>
        <p>$${ data.amount_received/100} USD</p>
        <p>por la compra de ${data.description}</p>
        `)
    }

    async getCustomerId(userData) {
        const user = await this.userService.getUserId(userData.id)
        // console.log(user)
        if (!user) return console.log('noexiste')
        if (!user.idCustomer) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.username
            })
            console.log('notiene')

            const newClient = await this.userService.updateUserIdCostumer(userData.id, customer.id)
            
            return newClient.idCustomer
        }
        console.log('tiene id')
        return user.idCustomer

    }


}

module.exports = Payments
