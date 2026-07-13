import uploadToCloudinary from "../middleware/cloudinaryMiddleware.js"
import Coupon from "../models/couponModel.js"
import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"
import Shop from "../models/shopModel.js"


const getShop = async (req, res) => {

    const userId = req.user._id

    const shop = await Shop.findOne({ user: userId })

    if (!shop) {
        res.status(404)
        throw new Error("Shop Not Found!")
    }

    res.status(200).json(shop)


}




const addShop = async (req, res) => {

    const { name, description, address, shopPhone } = req.body
    let user = req.user.id

    if (!name || !description || !address || !shopPhone) {
        res.status(409)
        throw new Error('Please Fill All Details!')
    }

    const shop = await Shop.create({ name, description, address, shopPhone, user })

    if (!shop) {
        res.status(401)
        throw new Error("Shop Not Created!")
    }

    res.status(201).json({
        message: "Request Has Been Sent To Admin",
        shop
    })


}

const updateShop = async (req, res) => {
    let shopId = req.params.sid

    if (req.body.status) {
        req.body.status = "pending"
    }

    const updatedShop = await Shop.findByIdAndUpdate(shopId, req.body, { new: true })

    if (!updatedShop) {
        res.status(409)
        throw new Error("Shop Not Updated!")
    }

    res.status(200).json(updatedShop)
}


const addProduct = async (req, res) => {

    const { name, description, price, stock, category, shopId } = req.body

    console.log(req.body)

    if (!name || !description || !price || !stock || !category) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }



    if (!req.file) {
        res.status(400)
        throw new Error("Please upload a product image")
    }

    // Upload File To Cloudinary (from memory buffer — no disk file)
    let uploadResponse = await uploadToCloudinary(req.file.buffer, req.file.mimetype)



    const product = new Product({
        name, description, price, stock, category, productImage: uploadResponse.secure_url, shop: shopId
    })

    await product.save()

    await product.populate("shop")

    if (!product) {
        res.status(409)
        throw new Error('Product Not Created!')
    }


    res.status(201).json(product)
}


const updateProduct = async (req, res) => {

    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true }).populate('shop')

    // Todo : Image Updation Pending

    if (!updatedProduct) {
        res.status(409)
        throw new Error('Product Not Updated!')
    }

    res.status(200).json(updatedProduct)


}


const createCoupon = async (req, res) => {

    const userId = req.user._id

    const { couponCode, couponDiscount } = req.body

    if (!couponCode || !couponDiscount) {
        res.status(409)
        throw new Error("Please Enter All Fields!")
    }

    // Find My Shop
    const shop = await Shop.findOne({ user: userId })


    const coupon = new Coupon({
        couponCode: couponCode.toUpperCase(),
        couponDiscount,
        shop: shop._id
    })

    await coupon.save()

    // await coupon.populate("shop")


    if (!coupon) {
        res.status(409)
        throw new Error("Coupon Not Created")
    }

    res.status(201).json(coupon)

}

const getMyShopOrders = async (req, res) => {

    let userId = req.user._id

    let shop = await Shop.findOne({ user: userId })

    if (!shop) {
        res.status(404)
        throw new Error("Shop Not Found")
    }

    let myAllOrders = await Order.find({ shop: shop._id }).populate("user").populate("products.product").populate("coupon")

    if (!myAllOrders) {
        res.status(404)
        throw new Error("Orders Not Found!")
    }

    res.status(200).json(myAllOrders)

}



const updateOrder = async (req, res) => {

    let orderId = req.params.oid

    let order = await Order.findById(orderId).populate("products.product")



    let { status } = req.body

    if (!status) {
        res.status(409)
        throw new Error("Status Not Found!")
    }

    // ["placed", "delivered", "dispatched", "cancelled"]

    const updateStock = async (productId, stock) => {
        await Product.findByIdAndUpdate(productId, { stock: stock }, { new: true })
    }


    let updatedOrder

    // If Cancelled
    if (status === "cancelled") {
        updatedOrder = await Order.findByIdAndUpdate(req.params.oid, { status: "cancelled" }, { new: true }).populate("user").populate("products").populate("coupon").populate("shop")

        // If Dispatched
    } else if (status === "dispatched") {

        // Updating Stock
        order.products.forEach((product) => {
            let productId = product.product._id
            let productQty = product.qty
            let currentStock = product.product.stock
            updateStock(productId, currentStock - productQty)
        })

        updatedOrder = await Order.findByIdAndUpdate(req.params.oid, { status: "dispatched" }, { new: true }).populate("user").populate("products").populate("coupon").populate("shop")
    } else {
        updatedOrder = await Order.findByIdAndUpdate(req.params.oid, { status: "delivered" }, { new: true }).populate("user").populate("products").populate("coupon").populate("shop")
    }



    if (!updatedOrder) {
        res.status(401)
        throw new Error("Order Not Updated")
    }

    res.status(200).json(updatedOrder)

}


const shopOwnerController = { addProduct, addShop, updateOrder, updateProduct, updateShop, createCoupon, getMyShopOrders, getShop }

export default shopOwnerController