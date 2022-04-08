const {stripe_pk,stripe_sk} = require('../config/envVars')
const stripe = require('stripe')(stripe_sk)
const PaymentsModel = require('../models/Payments')
const sendEmail = require('../libs/email')

const endpointSecret = "whsec_bca0b2dd09f9cdefcb2ef7915d4efc0e489ecbbc3009e74128afd2f606793d0a"
class Payments{
    async createIntent(amount,email,name,description,products){
        // https://stripe.com/docs/development/quickstart
        // https://stripe.com/docs/api/customers/create
        // TODO: agregar idCostumer a las cuentas en base de datos
        // si existe creamos una nueva y la guardamos sino usamos la misma
        // ver si podemos obtenerla desde tripe

        // TODO: redirect a la pagina tal con info del pago y registrarlo en baseD
        // y mandar email
        const customer = await stripe.customers.create({
            email,
            name
        })
        console.log(customer)
        const intent = await stripe.paymentIntents.create({
            customer:customer.id,
            amount: amount,//price
            currency:"usd",
            description
        })
        console.log(intent)
        return intent.client_secret
    }
    // async createCostumer(email){
    //     const costumer = await stripe.costumer

    // }
    
    createEvent(body,sign){
        let event;

        try {
            event = stripe.webhooks.constructEvent(body, sign, endpointSecret);

            if(event.type==="payment_intent.succeeded"){
                console.log(event.data.object)
                const {id,amount,amount_received,client_secret,currency,shipping,receipt_email} = event.data.object
                const infoPayment ={
                    id,amount,amount_received,client_secret,currency,shipping,receipt_email
                }
                this.createPaymentHistory(infoPayment)
                console.log(infoPayment)
                return {success:true}
            }else{
                return {success:true}
            }
            
        } catch (err) {
            return {success:false,message:`Webhook Error: ${err.message}`}

        }
    }

    async createPaymentHistory(data){
        return await PaymentsModel.create({...data})
    }
    async getPayments(){
        return await PaymentsModel.find()
    }
    async sendEmailPayInfo(data){
        await sendEmail(data.receipt_email,"Recibo Efruits","gracias por su compra",`
        <h1>Recibo de Compra</h1>
        <p>$${data.amount_received}</p>
        <p>por la compra de ${data.description}</p>
        `)
    }



}

module.exports = Payments
