import express from "express"
import adminControllers from "../controllers/adminController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

// Get Users
router.get("/users", protect.forAdmin, adminControllers.getUsers)

// Update User
router.put("/users/:uid", protect.forAdmin, adminControllers.updateUser)

// Get All Orders
router.get("/orders", protect.forAdmin, adminControllers.getAllOrders)

// Update Order Status
router.put("/orders/:oid", protect.forAdmin, adminControllers.updateOrder)

// Get All Shops
router.get("/shops", protect.forAdmin, adminControllers.getAllShops)

// Update Shop
router.put("/shops/:sid", protect.forAdmin, adminControllers.updateShop)



export default router