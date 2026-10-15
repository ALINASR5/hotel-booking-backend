import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app = express();

app.use(cors());

app.use(clerkMiddleware());

// API to listen to Clerk webhooks
app.use("/webhooks/clerk", clerkWebhooks);

// JSON middleware for the rest of the API
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is working");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));