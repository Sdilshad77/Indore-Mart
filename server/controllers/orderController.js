import Cart from "../models/cartModel.js"
import Coupon from "../models/couponModel.js"
import Order from "../models/orderModel.js"

const getMyOrders = async (req, res) => {

    const userId = req.user._id

    const myOrders = await Order.find({ user: userId }).populate('user').populate('products.product')

    if (!myOrders) {
        res.status(404)
        throw new Error("Orders Not Found!")
    }

    res.status(200).json(myOrders)



}

const getMyOrder = async (req, res) => {
    const myOrder = await Order.findById(req.params.oid).populate("user").populate("shop").populate("products").populate("coupon")

    if (!myOrder) {
        res.status(404)
        throw new Error("Order Not Found!")
    }

    res.status(200).json(myOrder)

}

const createOrder = async (req, res) => {

    const userId = req.user._id

    let couponExists

    if (req.body.couponCode) {
        // Find Coupon
        couponExists = await Coupon.findOne({ couponCode: req.body.couponCode })

        if (!couponExists) {
            res.status(404)
            throw new Error("Invalid Coupon")
        }

    }


    // Find Cart
    const cart = await Cart.findOne({ user: userId }).populate("products.product")


    if (!cart) {
        res.status(404)
        throw new Error("Cart Not Found!")
    }

    let billedProducts = cart.products.map((product) => {
        return {
            product: product.product._id,
            qty: product.qty,
            purchasedPrice: product.product.price
        }
    })



    let totalBill = cart.products.reduce((acc, item) => {
        return acc + item.product.price * item.qty
    }, 0)

    let discount = couponExists ? totalBill * couponExists.couponDiscount / 100 : 0

    let shop = cart.products[0].product.shop

    const order = new Order({
        user: userId,
        products: billedProducts,
        shop: shop,
        status: "placed",
        isDiscounted: couponExists ? true : false,
        coupon: couponExists ? couponExists._id : null,
        totalBillAmount: totalBill - discount
    })

    await order.populate("products.product")
    await order.save()

    if (!order) {
        res.status(409)
        throw new Error("Order Not Placed")
    }

    // Clear Cart
    await cart.deleteOne({ user: userId })

    res.status(201).json(order)

}


const cancelOrder = async (req, res) => {

    const order = await Order.findById(req.params.oid)

    if (order.status === "placed") {
        const cancelledOrder = await Order.findByIdAndUpdate(req.params.oid, { status: "cancelled" }, { new: true })
        res.status(200).json(cancelledOrder)
    } else {
        res.status(409)
        throw new Error("Order Cannot Be Cancelled! After Dispatched")
    }

}


const orderController = { getMyOrders, getMyOrder, createOrder, cancelOrder }

export default orderController