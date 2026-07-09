import Order from "../models/orderModel.js"
import Shop from "../models/shopModel.js"
import User from "../models/userModel.js"

const getUsers = async (req, res) => {
    const users = await User.find()

    if (!users) {
        res.status(404)
        throw new Error('Users Not Found!')
    } else {
        res.status(200).json(users)
    }
}

const getAllOrders = async (req, res) => {
    const allOrders = await Order.find().populate("user").populate("products.product").populate("coupon").populate('shop')


    if (!allOrders) {
        res.status(404)
        throw new Error("Orders Not Found!")
    }

    res.status(200).json(allOrders)

}

const updateUser = async (req, res) => {


    // if (!req.body.isActive) {
    //     res.status(409)
    //     throw new Error('Please Send Status Of User')
    // }

    const updatedUser = await User.findByIdAndUpdate(req.params.uid, { isActive: req.body.isActive ? true : false }, { new: true })

    if (!updatedUser) {
        res.status(409)
        throw new Error('UserNot Updated')
    }

    res.status(200).json(updatedUser)

}

const getAllShops = async (req, res) => {

    const shops = await Shop.find().populate("user")

    if (!shops) {
        res.status(404)
        throw new Error('Shops Not Found')
    }


    res.status(200).json(shops)

}


const updateShop = async (req, res) => {

    if (!req.body.status) {
        res.status(409)
        throw new Error('Please Tell The Status!')
    }

    let shopId = req.params.sid

    const updatedShop = await Shop.findByIdAndUpdate(shopId, req.body, { new: true })

    if (!updatedShop) {
        res.status(409)
        throw new Error('Shop Cannot Be Activated!')
    }

    // Update The User
    await User.findByIdAndUpdate(updatedShop.user, { isShopOwner: true }, { new: true })

    res.status(200).json(updatedShop)


}





const updateOrder = async (req, res) => {
    const { status } = req.body
    const validStatuses = ["placed", "delivered", "dispatched", "cancelled"]

    if (!status || !validStatuses.includes(status)) {
        res.status(400)
        throw new Error('Invalid order status')
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.oid,
        { status },
        { new: true }
    ).populate("user").populate("products.product").populate("coupon").populate('shop')

    if (!updatedOrder) {
        res.status(404)
        throw new Error('Order not found')
    }

    res.status(200).json(updatedOrder)
}




const adminControllers = { getUsers, getAllOrders, updateShop, updateUser, getAllShops, updateOrder }


export default adminControllers