const express = require('express')
const payments = require('../services/payments')

const Payments=(app)=>{
    const router = express.Router()

    app.use('/api/payments',router)
    
    const pay = new payments()

    router.post("/intent",async (req,res)=>{
        const intent = await pay.createIntent(req.body.amount)

        return res.json({
            clientSecret:intent
        })
    })
    
    router.post("/webhook",async(req,res)=>{
        const sig = req.headers['stripe-signature'];

        const result = pay.createEvent(req.body,sig)
        
        if(result.success){
            return res.status(200).send()
        }

        return res.status(400).send();
    })
}
module.exports=Payments