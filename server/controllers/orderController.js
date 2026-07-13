import Cart from "../models/cartModel.js"
import Coupon from "../models/couponModel.js"
import Order from "../models/orderModel.js"

// GET /api/orders — Get all orders of logged-in user
const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user._id

        const myOrders = await Order.find({ user: userId })
            .populate("user")
            .populate("products.product")

        res.status(200).json(myOrders)
    } catch (err) {
        console.error("[getMyOrders] Error:", err.message)
        next(err)
    }
}

// GET /api/orders/:oid — Get a single order
const getMyOrder = async (req, res, next) => {
    try {
        const myOrder = await Order.findById(req.params.oid)
            .populate("user")
            .populate("shop")
            .populate("products.product")
            .populate("coupon")

        if (!myOrder) {
            res.status(404)
            throw new Error("Order Not Found!")
        }

        res.status(200).json(myOrder)
    } catch (err) {
        console.error("[getMyOrder] Error:", err.message)
        if (!res.headersSent) {
            next(err)
        }
    }
}

// POST /api/orders — Create an order from cart
const createOrder = async (req, res, next) => {
    try {
        const userId = req.user._id

        // ── Validate coupon if provided ──
        let couponExists = null
        if (req.body.couponCode && req.body.couponCode.trim()) {
            couponExists = await Coupon.findOne({ couponCode: req.body.couponCode.trim() })
            if (!couponExists) {
                res.status(404)
                throw new Error("Invalid Coupon Code")
            }
        }

        // ── Find cart with populated products (and shop inside each product) ──
        const cart = await Cart.findOne({ user: userId }).populate({
            path: 'products.product',
            populate: { path: 'shop', select: '_id' }
        })

        if (!cart || !cart.products || cart.products.length === 0) {
            res.status(400)
            throw new Error("Your cart is empty. Please add items before placing an order.")
        }

        // ── Validate all products are still available ──
        for (const item of cart.products) {
            if (!item.product) {
                res.status(400)
                throw new Error("One or more products in your cart are no longer available.")
            }
        }

        // ── Build billed products array ──
        const billedProducts = cart.products.map((item) => ({
            product: item.product._id,
            qty: item.qty,
            purchasedPrice: item.product.price,
        }))

        // ── Calculate totals ──
        const subtotal = cart.products.reduce((acc, item) => {
            return acc + item.product.price * item.qty
        }, 0)

        const discount = couponExists
            ? (subtotal * couponExists.couponDiscount) / 100
            : 0

        const totalBillAmount = subtotal - discount

        // ── Get shop from first cart item — handle both ObjectId and populated object ──
        const shopRef = cart.products[0].product.shop
        const shop = shopRef?._id ?? shopRef   // if populated → use _id; if raw ObjectId → use directly

        if (!shop) {
            res.status(400)
            throw new Error("Unable to determine shop from cart items. Please refresh and try again.")
        }

        // ── Create and save the order ──
        const order = new Order({
            user: userId,
            products: billedProducts,
            shop: shop,
            status: "placed",
            isDiscounted: !!couponExists,
            coupon: couponExists ? couponExists._id : null,
            totalBillAmount,
        })

        // Save first, then populate for response
        await order.save()
        await order.populate("products.product")

        // ── Clear the cart ──
        await Cart.deleteOne({ user: userId })

        res.status(201).json(order)
    } catch (err) {
        console.error("[createOrder] Error:", err.message)
        console.error("[createOrder] Stack:", err.stack)
        if (!res.headersSent) {
            next(err)
        }
    }
}

// PUT /api/orders/:oid — Cancel an order
const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.oid)

        if (!order) {
            res.status(404)
            throw new Error("Order Not Found!")
        }

        if (order.status !== "placed") {
            res.status(409)
            throw new Error("Order Cannot Be Cancelled! It has already been dispatched or delivered.")
        }

        const cancelledOrder = await Order.findByIdAndUpdate(
            req.params.oid,
            { status: "cancelled" },
            { new: true }
        )

        res.status(200).json(cancelledOrder)
    } catch (err) {
        console.error("[cancelOrder] Error:", err.message)
        if (!res.headersSent) {
            next(err)
        }
    }
}

const orderController = { getMyOrders, getMyOrder, createOrder, cancelOrder }

export default orderController