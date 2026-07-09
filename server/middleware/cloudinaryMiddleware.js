import fs from "node:fs"
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"

dotenv.config()

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



const uploadToCloudinary = async (fileLink) => {
    try {
        let response = await cloudinary.uploader.upload(fileLink, { resource_type: "auto" })
        return response
    } catch (error) {
        // Safely clean up temp file if it still exists
        try { if (fs.existsSync(fileLink)) fs.unlinkSync(fileLink) } catch (_) {}
        console.log('Cloudinary upload error:', error.message)
        throw error
    }
}

export default uploadToCloudinary


