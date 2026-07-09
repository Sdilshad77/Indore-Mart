import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    shopPhone: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }


}, {
    timestamps: true
})


const Shop = mongoose.model("Shop", shopSchema)


export default Shop