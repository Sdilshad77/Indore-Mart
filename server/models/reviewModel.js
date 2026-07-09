import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
    rating: {
        type: Number,
        min: [1, "Rating cannot be less than 1"],
        max: [5, "Rating cannot be greater than 5"],
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    isVerifiedBuyer: {
        type: Boolean,
        required: true,
        default: false
    }

}, {
    timestamps: true
})

const Review = mongoose.model("Review", reviewSchema)

export default Review