import multer from "multer"
import fs from "node:fs"
import path from "node:path"

// Auto-create uploads/ directory if it doesn't exist
const uploadDir = "uploads/"
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop()
        cb(null, `product-${crypto.randomUUID()}.${ext}`)
    }
})

const upload = multer({ storage: storage })

export default upload