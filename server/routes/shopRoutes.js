import express from "express"
import shopController from "../controllers/shopController.js"

const router = express.Router()


router.get("/", shopController.getShops)
router.get("/:sid", shopController.getShop)


export default router