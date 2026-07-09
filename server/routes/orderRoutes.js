import express from "express"
import protect from "../middleware/authMiddleware.js"
import orderController from "../controllers/orderController.js"



const router = express.Router()

router.get("/", protect.forAuthUsers, orderController.getMyOrders)
router.get("/:oid", protect.forAuthUsers, orderController.getMyOrder)
router.post("/", protect.forAuthUsers, orderController.createOrder)
router.put("/:oid", protect.forAuthUsers, orderController.cancelOrder)


export default router