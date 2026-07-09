import express from "express"
import protect from "../middleware/authMiddleware.js"
import { getAnswer } from "../controllers/chatBotController.js"


const router = express.Router()


router.post("/", protect.forAuthUsers, getAnswer)


export default router