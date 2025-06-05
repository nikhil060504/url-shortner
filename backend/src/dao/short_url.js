import urlSchema from "../models/short_url.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
  try {
    const newUrl = new urlSchema({
      short_url: shortUrl,
      full_url: longUrl,
    });

    if (userId) {
      newUrl.user = userId;
    }

    return await newUrl.save(); // Return the saved document
  } catch (err) {
    console.log(err);
    throw new ConflictError(err.message || "Failed to save URL");
  }
};

export const findUrlFromShortUrl = async (shorturl) => {
  return await urlSchema.findOneAndUpdate(
    { short_url: shorturl },
    { $inc: { clicks: 1 } },
    { new: true } // Return the updated document
  );
};

export const getShorturl = async (shortUrl) => {
  return await urlSchema.findOneAndUpdate(
    { short_url: shortUrl },
    { $inc: { clicks: 1 } },
    { new: true }
  );
};
export const getCustomShortUrl = async (slug) => {
  const exist = await urlSchema.findOne({ short_url: slug });
  return exist ? exist.short_url : null;
};

// Find all URLs for a specific user
export const findUrlsByUserId = async (userId) => {
  try {
    return await urlSchema.find({ user: userId }).sort({ createdAt: -1 });
  } catch (err) {
    console.error("Error finding URLs by user ID:", err);
    throw err;
  }
};

// Delete a URL by ID and user ID (for security)
export const deleteUrlById = async (urlId, userId) => {
  try {
    return await urlSchema.findOneAndDelete({
      _id: urlId,
      user: userId,
    });
  } catch (err) {
    console.error("Error deleting URL:", err);
    throw err;
  }
};
