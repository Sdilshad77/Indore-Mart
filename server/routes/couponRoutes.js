import express from "express"
import couponController from "../controllers/couponController.js"


const router = express.Router()


// get coupons
router.get("/:sid", couponController.getCoupons)
router.post("/apply", couponController.applyCoupon)



export default router