const express = require('express')
const {isAdmin,isEditorPage,isUser} = require('../middlewares/auth')
const Cart = require('../services/cart')

const cartRoutes =(app)=>{
    const router = express.Router()
    const cartService = new Cart()

    app.use('/cart/service',router)

    
    router.get('/',isUser,async(req,res)=>{
        const carts = await cartService.getCartUser(req.userData.id)
        return res.json(carts)
    })
    router.get('/all',isAdmin,async(req,res)=>{
        const carts = await cartService.getCarts()
        return res.json(carts)
    })
    router.post('/create/:idUser',isAdmin,async(req,res)=>{
        const carts = await cartService.createCartUser(req.params.idUser)
        return res.json(carts)
    })
    router.post('/product/add',isUser,async(req,res)=>{
        const carts = await cartService.addProductToCart(req.userData.id,req.body.idProduct)
        return res.json(carts)
    })
    router.post('/product/update/quantity',isUser,async(req,res)=>{
        const carts = await cartService.addCuantityToProductCart(req.userData.id,req.body)
        return res.json(carts)
    })
    router.delete('/product/pull',isUser,async(req,res)=>{
        const carts = await cartService.deleteProductOnCart(req.userData.id,req.body.idProduct)
        return res.json(carts)
    })
}
module.exports = cartRoutes