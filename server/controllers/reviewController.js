import Order from "../models/orderModel.js"
import Review from "../models/reviewModel.js"

const getReviews = async (req, res) => {

    const productId = req.pid


    let reviews = await Review.find({ product: productId })

    if (!reviews) {
        res.status(404)
        throw new Error("Reviews Not Found")
    }

    res.status(200).json(reviews)

}


const addReview = async (req, res) => {

    const productId = req.pid
    const userId = req.user._id

    const { rating, text } = req.body

    if (!rating || !text) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Find If this product is in users order history

    let orderHistory = await Order.find({ user: userId })

    let purchasedBefore


    orderHistory.forEach((orders) => {
        orders.products.forEach((order) => {
            if (order.product.toString() === productId) {
                purchasedBefore = true
                return
            }
        })
    })

    const review = await Review.create({
        user: userId,
        product: productId,
        rating: rating,
        text: text,
        isVerifiedBuyer: purchasedBefore || false
    })

    res.status(201).json(review)

}

const removeReview = async (req, res) => {
    const reviewId = req.params.rid

    await Review.findByIdAndDelete(reviewId)

    res.status(200)
        .json({
            message: "Review Removed",
            _id: reviewId
        })


}


const reviewController = { getReviews, addReview, removeReview }

export default reviewController