const CartModel = require('../models/cart')

class Cart{
    async getCarts(){
        return await CartModel.find()
    }
    async getCartUser(idUser){
        return await CartModel.findOne({idUser}).populate('products._id')
    }
    async createCartUser(idUser){
        return await CartModel.create({idUser})
    }
    async addProductToCart(idUser,idProduct){
        const cart = await CartModel.findOne({idUser})
        let productOn=false
        cart.products.forEach(product => {if(product._id.valueOf()===idProduct) return productOn = true})
        
        if(!productOn){
            return await CartModel.findOneAndUpdate({idUser},{
                $push:{products:{_id:idProduct,quantity:1}}
            },{new:true})
        }
        return {success:false,message:"Product alredy in your cart"}
    }

    async addCuantityToProductCart(idUser,{idProduct,quantity}){
        return await CartModel.findOneAndUpdate({idUser},{
            $set:{"products.$[products].quantity":quantity}
        },{
            new:true,
            arrayFilters:[{"products._id":idProduct}]
        })   
    }

    async deleteProductOnCart(idUser,idProduct){
        return await CartModel.findOneAndUpdate({idUser},{
            $pull:{products:{_id:idProduct}}
        },{new:true})
    }

}

module.exports = Cart