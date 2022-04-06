const express = require('express')
const { isUser } = require('../middlewares/auth')
const payments = require('../services/payments')

const Payments=(app)=>{
    const router = express.Router()

    app.use('/api/payments',router)
    
    const pay = new payments()

    // router.post("/intent",async (req,res)=>{
    //     const intent = await pay.createIntent(req.body.amount)

    //     return res.json({
    //         clientSecret:intent
    //     })
    // })

    router.post("/intent/user",async (req,res)=>{
        const [email,username] = ["cjuan.chona@hotmail.com","Juan"]
        // const {email,username} = req.userData
        console.log(req.userData)
        const intent = await pay.createIntent(req.body.amount,email,username)

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