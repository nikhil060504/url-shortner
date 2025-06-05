import dotenv from "dotenv";
import express from "express";
import cors from "cors";
const app = express();
import short_url from "./src/routes/short_url.route.js";
import authRoute from "./src/routes/auth.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
dotenv.config();

import connectDB from "./src/config/mongo.config.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { attachuser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser";

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "https://url-shortner-1prr.vercel.app"], // Vite dev server and other common ports
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachuser);
app.use("/api/auth", authRoute);
app.use("/api/create", short_url);
app.use("/api", short_url); // This handles /api/urls routes

app.get("/:id", redirectFromShortUrl);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB()
});
