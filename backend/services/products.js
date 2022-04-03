const validateCreate = require("../helpers/validateErrors");
const { uploadFile, deleteFile } = require("../libs/storage");
const ProductsModel = require("../models/products");

class ProductsService {
    async getAllProducts() {
        return await ProductsModel.find()
    }
    async getOneProductId(idProduct) {
        return await ProductsModel.findById(idProduct)
    }
    async getOneProductbyName(name) {
        return await ProductsModel.findOne({ name })
    }
    async createProduct(data, file, idUser) {

        let product = new ProductsModel({ ...data, idCreator: idUser })
        const response = validateCreate(product)
        if (response.error === true) return response

        if (file) {
            const uploadResponse = await uploadFile(file.originalname, file.buffer)
            product.pics.push(uploadResponse.fileName)
        }

        const productCreated = await product.save()
        return { ...productCreated._doc, success: true }
    }

    async updateProduct(idProduct, { name, price, description, categories }, file) {
        if (file) {
            const uploadResponse = await uploadFile(file.originalname, file.buffer)
            return await ProductsModel.findByIdAndUpdate(idProduct, {
                name, price, description,
                $push: { categories },
                $push: { pics: uploadResponse?.fileName }
            },{ new: true })
        }
        return await ProductsModel.findByIdAndUpdate(idProduct, { name, price, description, $push: { categories } }, { new: true })
    }

    async deleteProduct(idProduct) {
        const productDeleated = await ProductsModel.findByIdAndDelete(idProduct)
        if (productDeleated) productDeleated?.pics?.forEach(pic => { deleteFile(pic) })
        return productDeleated
    }

    async updatePullArrays(idProduct,{pics,categories}){
        return await ProductsModel.findByIdAndUpdate(idProduct,{
            $pull:{categories}
        })
    }

}
module.exports = ProductsService