import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import { connectDB } from "./config/dbConfig.js";
import dns from "node:dns/promises";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

// Routes
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import shopOwnerRoutes from "./routes/shopOwnerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import chatBotRoutes from "./routes/chatBotRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Database
connectDB();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/shop-owner", shopOwnerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/chat", chatBotRoutes);

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "WELCOME TO INDORE BAZAR API",
    });
});

// Error Handler
app.use(errorHandler);

// Server
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`.bgBlue.black);
});