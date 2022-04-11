const validateCreate = require("../helpers/validateErrors");
const { uploadFile, deleteFile } = require("../libs/storage");
const ProductsModel = require("../models/products");

class ProductsService {
    async getAllProducts() {
        return await ProductsModel.find()
    }
    async getPageProducts(page = 1, limit = 10) {
        const amountProducts = await ProductsModel.count()


        const numberPages = amountProducts / limit
        const totalPages = Math.round(numberPages) < numberPages ? Math.round(numberPages) + 1 : Math.round(numberPages)

        if (totalPages < page) {
            return { success: false, message: "this page not exist" }
        }
        const skip = (page - 1) * limit
        const products = await ProductsModel.find().skip(skip).limit(limit)

        const nextPage = page === totalPages ? null : "/api/products?page=" + (page + 1)+"&limit=" +limit
        const prevPage = page === 1 ? null : "/api/products?page=" + (page - 1) +"&limit=" +limit
        return {
            success: true,
            data: products,
            amountProducts,
            page,
            totalPages,
            nextPage,
            prevPage
        }
    }
    async searchProduct(name) {
        const allProducts = await ProductsModel.find()
        const productsMach = allProducts.filter(product => {
            if (product.name.indexOf(name) !== -1) return product
        })
        return productsMach
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
            }, { new: true })
        }
        return await ProductsModel.findByIdAndUpdate(idProduct, { name, price, description, $push: { categories } }, { new: true })
    }

    async deleteProduct(idProduct) {
        const productDeleated = await ProductsModel.findByIdAndDelete(idProduct)
        if (productDeleated) productDeleated?.pics?.forEach(pic => { deleteFile(pic) })
        return productDeleated
    }

    async updatePullArrays(idProduct, { pics, categories }) {
        // comprobamos si la pic esta en pics sino no eliminamos
        const product = await ProductsModel.findById(idProduct)
        product.pics.forEach(pic => {
            if (pic === pics) deleteFile(pics)
        })
        return await ProductsModel.findByIdAndUpdate(idProduct, {
            $pull: { categories },
            $pull: { pics }
        }, { new: true })
    }

    async filterCategory(category) {
        return await ProductsModel.find({ categories: { $in: [category] } })
    }
    async filterCategoryPage(category,page = 1, limit = 10) {
        const amountProducts = await ProductsModel.count({ categories: { $in: [category] } })

        const numberPages = amountProducts / limit
        const totalPages = Math.round(numberPages) < numberPages ? Math.round(numberPages) + 1 : Math.round(numberPages)

        if (totalPages < page) {
            return { success: false, message: "this page not exist" }
        }
        const skip = (page - 1) * limit
        const products = await ProductsModel.find({ categories: { $in: [category] } }).skip(skip).limit(limit)

        const nextPage = page === totalPages ? null : "/api/products?page=" + (page + 1)+"&limit=" +limit +"&category=" +category
        const prevPage = page === 1 ? null : "/api/products?page=" + (page - 1) +"&limit=" +limit +"&category=" +category
        return {
            success: true,
            data: products,
            amountProducts,
            page,
            totalPages,
            nextPage,
            prevPage
        }
    }
    async newProducts(numberOfProducts=3){
        const quantity = await ProductsModel.count()
        if(quantity>numberOfProducts) {
            const products = await ProductsModel.find().skip(quantity-numberOfProducts)
            return products.reverse()

        }
        const products = await ProductsModel.find()
        return products.reverse()
    }
}
module.exports = ProductsService