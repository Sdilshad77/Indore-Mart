import multer from "multer"

// Use memory storage — no disk dependency (works on Render/cloud)
const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

export default upload