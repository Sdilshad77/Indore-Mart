import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({

    couponCode: {
        type: String,
        required: [true, "Please Enter Coupon Code"]
    },
    couponDiscount: {
        type: Number,
        required: [true, "Please Enter Rate Of Discount"]
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }, shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    }


}, {
    timestamps: true
})

const Coupon = mongoose.model("Coupon", couponSchema)

export default Coupon