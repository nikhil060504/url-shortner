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
    origin: ["http://localhost:5173", "http://localhost:5000"], // Vite dev server and other common ports
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

app.listen(5000, () => {
  connectDB();
  console.log("Server is running onport http://localhost:5000");
});
