import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { connectDB } from "./config/dbConfig.js"
import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config()

// Local Imports
import { errorHandler } from "./middleware/errorHandler.js"
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import shopOwnerRoutes from "./routes/shopOwnerRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import shopRoutes from "./routes/shopRoutes.js"
import couponRoutes from "./routes/couponRoutes.js"
import chatBotRoutes from "./routes/chatBotRoutes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// DB Connection
connectDB()

// CORS — allow all origins in dev, restrict to same-origin in prod (static serving handles it)
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}))

// Body-Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve built React app in production
if (process.env.NODE_ENV === "production") {
    const clientDist = path.join(__dirname, "../client/dist")
    app.use(express.static(clientDist))
}

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/shop-owner", shopOwnerRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/shops", shopRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/chat", chatBotRoutes)

// Catch-all: serve React app for any non-API route (production only)
if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.status(200).json({ message: "WELCOME TO INDORE BAZAR API 1.00" })
    })
}

// Error Handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue.black))