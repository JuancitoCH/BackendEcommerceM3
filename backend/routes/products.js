const express = require('express')
const {isAdmin, isEditorPage, isUser} = require('../middlewares/auth')
const upload = require('../middlewares/multerConfig')
const Products = require('../services/products')


const productsRoutes =(app)=>{
    const router = express.Router()
    const productService = new Products()

    app.use('/products',router)

    router.get('/all',async(req,res)=>{
        const allProducts=await productService.getAllProducts()
        return res.json(allProducts)
    })

    router.post('/create',isEditorPage,upload.single('pic'),async(req,res)=>{
        const response = await productService.createProduct(req.body,req.file,req.userData.id)
        return res.json(response)
    })

   
    
}
module.exports = productsRoutes