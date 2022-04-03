const validateCreate = require("../helpers/validateErrors");
const { uploadFile } = require("../libs/storage");
const ProductsModel = require("../models/products");

class ProductsService{
    async getAllProducts(){
        return await ProductsModel.find()
    }
    async getOneProductId(idProduct){
        return await ProductsModel.findById(idProduct)
    }
    async getOneProductbyName(name){
        return await ProductsModel.findOne({name})
    }
    async createProduct(data,file,idUser){

        let product = new ProductsModel({...data,idCreator:idUser})
        const response = validateCreate(product)
        if(response.error===true) return response
        
        if(file){
            const uploadResponse = await uploadFile(file.originalname,file.buffer)
            product.pics.push(uploadResponse.fileName)
        }
        
        const productCreated = await product.save()
        return {...productCreated._doc,success:true}
    }
    
    async updateProduct(idProduct,data){
        return await ProductsModel.findByIdAndUpdate(idProduct,data)
    }
    async deleteProduct(idProduct){
        return await ProductsModel.findByIdAndDelete(idProduct)
    }

    
}
module.exports = ProductsService