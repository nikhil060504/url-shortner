import {
  createShortUrlServicesWithoutUser,
  createShortUrlServicesWithUser,
} from "../services/short_url.services.js";
import { generateNanoId } from "../utils/helper.js";
import {
  findUrlFromShortUrl,
  findUrlsByUserId,
  deleteUrlById,
} from "../dao/short_url.js";
import { BadRequestError, NotFoundError } from "../utils/errorHandler.js";

export const createShortUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    // Validate URL
    if (!url) {
      throw new BadRequestError("URL is required");
    }

    console.log("Creating short URL for:", url);

    let shortUrl;
    // Check if user is authenticated
    if (req.user) {
      console.log("Creating URL for authenticated user:", req.user._id);
      shortUrl = await createShortUrlServicesWithUser(url, req.user._id);
    } else {
      console.log("Creating URL for anonymous user");
      shortUrl = await createShortUrlServicesWithoutUser(url);
    }

    const fullShortUrl = process.env.APP_URL + shortUrl;

    res.status(200).json({
      success: true,
      data: fullShortUrl,
      message: "Short URL created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all URLs for authenticated user
export const getUserUrls = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new BadRequestError("Authentication required");
    }

    console.log("Fetching URLs for user:", req.user._id);
    const urls = await findUrlsByUserId(req.user._id);

    // Transform the data to match frontend expectations
    const transformedUrls = urls.map((url) => ({
      id: url._id,
      originalUrl: url.full_url,
      shortUrl: process.env.APP_URL + url.short_url,
      createdAt: url.createdAt || new Date(),
      clicks: url.clicks || 0,
    }));

    res.status(200).json({
      success: true,
      data: transformedUrls,
      message: "URLs fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user URLs:", error);
    next(error);
  }
};

// Delete a specific URL for authenticated user
export const deleteUserUrl = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new BadRequestError("Authentication required");
    }

    const { id } = req.params;
    console.log("Deleting URL:", id, "for user:", req.user._id);

    const deletedUrl = await deleteUrlById(id, req.user._id);

    if (!deletedUrl) {
      throw new NotFoundError(
        "URL not found or you don't have permission to delete it"
      );
    }

    res.status(200).json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting URL:", error);
    next(error);
  }
};

export const redirectFromShortUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = await findUrlFromShortUrl(id);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    // Increment click count
    url.clicks = (url.clicks || 0) + 1;
    await url.save();

    res.redirect(url.full_url);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
