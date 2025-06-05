import express from "express";
import {
  createShortUrl,
  getUserUrls,
  deleteUserUrl,
} from "../controller/short_url.controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";
const router = express.Router();

// Create short URL (works for both authenticated and anonymous users)
router.post("/", authMiddleware, createShortUrl);

// Get user's URLs (requires authentication)
router.get("/urls", authMiddleware, getUserUrls);

// Delete specific URL (requires authentication)
router.delete("/urls/:id", authMiddleware, deleteUserUrl);

export default router;
