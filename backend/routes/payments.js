const express = require('express')
const { isUser } = require('../middlewares/auth')
const payments = require('../services/payments')
const Product = require('../services/products')
const Cart = require('../services/cart')

const Payments=(app)=>{
    const router = express.Router()

    app.use('/api/payments',router)
    
    const pay = new payments()
    const productsService = new Product()
    const cartService = new Cart()

    // router.post("/intent",async (req,res)=>{
    //     const intent = await pay.createIntent(req.body.amount)

    //     return res.json({
    //         clientSecret:intent
    //     })
    // })

    router.post("/intent/user",isUser,async (req,res)=>{
        if(!req.body.idProduct)return res.json({message:"idProduct is required",success:false})
        const {price,name} = await productsService.getOneProductId(req.body.idProduct)
        const intent = await pay.createIntent(price,req.userData,name,req.body.quantity)
        if(intent.success===false) return res.json(intent)
        return res.json({
            clientSecret:intent
        })
    })

    router.post("/intent/user/cart",isUser,async (req,res)=>{
        
        const userCart = await cartService.getCartUser(req.userData.id)
        const intent = await pay.createIntentCart(req.userData,userCart)
        if(intent.success===false) return res.json(intent)
        

        return res.json({
            clientSecret:intent
        })
    })
    
    router.post("/webhook",async(req,res)=>{
        // ahora stripe esta a la escucha del webhook online
        const sig = req.headers['stripe-signature'];
        const result = await pay.createEvent(req.body,sig)
        if(result.success){
            return res.status(200).send()
        }

        return res.status(400).send(result);
    })
    router.get('/history',async(req,res)=>{
        const recips = await pay.getPayments()
        return res.json(recips)
    })
}
module.exports=Payments