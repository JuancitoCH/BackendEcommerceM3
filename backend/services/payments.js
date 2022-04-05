const {stripe_pk,stripe_sk} = require('../config/envVars')
const stripe = require('stripe')(stripe_sk)

const endpointSecret = "whsec_bca0b2dd09f9cdefcb2ef7915d4efc0e489ecbbc3009e74128afd2f606793d0a"
class Payments{
    async createIntent(amount){
        const intent = await stripe.paymentIntents.create({
            amount: amount,//price
            currency:"usd"
        })
        console.log(intent)
        return intent.client_secret
    }
    async createCostumer(email){
        const costumer = await stripe.costumer

    }
    
    createEvent(body,sign){
        let event;

        try {
            event = stripe.webhooks.constructEvent(body, sign, endpointSecret);

            if(event.type==="payment_intent.succeeded"){
                console.log(event.data)
                return {success:true}
            }else{
                return {success:true}
            }
            
        } catch (err) {
            return {success:false,message:`Webhook Error: ${err.message}`}

        }
    }
}

module.exports = Payments
