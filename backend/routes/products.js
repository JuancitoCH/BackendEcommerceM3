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
    router.get('/id/:idProduct',async(req,res)=>{
        const product=await productService.getOneProductId(req.params.idProduct)
        return res.json(product)
    })
    router.get('/name/:name',async(req,res)=>{
        const product=await productService.getOneProductbyName(req.params.name)
        return res.json(product)
    })
    router.get('/search/:name',async(req,res)=>{
        const product=await productService.searchProduct(req.params.name)
        return res.json(product)
    })

    router.post('/create',isEditorPage,upload.single('pic'),async(req,res)=>{
        const response = await productService.createProduct(req.body,req.file,req.userData.id)
        return res.json(response)
    })
    router.delete('/delete/:idProduct',isEditorPage,async(req,res)=>{
        const response = await productService.deleteProduct(req.params.idProduct)
        return res.json(response)
    })
    router.post('/update/:idProduct',upload.single('pic'),isEditorPage,async(req,res)=>{
        const response = await productService.updateProduct(req.params.idProduct,req.body,req.file)
        return res.json(response)
    })

    router.post('/pull/product/:idProduct',isEditorPage,async(req,res)=>{
        const response = await productService.updatePullArrays(req.params.idProduct,req.body)
        return res.json(response)
    })
    

   
    
}
module.exports = productsRoutes