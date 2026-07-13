import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"

dotenv.config()

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload from buffer (memoryStorage) — no disk file needed
const uploadToCloudinary = (fileBuffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    console.log('Cloudinary upload error:', error.message)
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )
        stream.end(fileBuffer)
    })
}

export default uploadToCloudinary
