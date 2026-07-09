import express from "express"
import reviewController from "../controllers/reviewController.js"
import protect from "../middleware/authMiddleware.js"



const router = express.Router()


router.get("/", reviewController.getReviews)
router.post("/", protect.forAuthUsers, reviewController.addReview)
router.delete("/:rid", reviewController.removeReview)

export default router