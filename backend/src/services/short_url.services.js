import { generateNanoId } from "../utils/helper.js";
import urlSchema from "../models/short_url.model.js";
import { saveShortUrl, getCustomShortUrl } from "../dao/short_url.js";

export const createShortUrlServicesWithoutUser = async (url) => {
  const shortUrl = generateNanoId(7);
  if (!shortUrl) {
    throw new Error("Failed to generate short url");
  }
  await saveShortUrl(shortUrl, url);

  return shortUrl;
};

export const createShortUrlServicesWithUser = async (
  url,
  userId,
  slug = null
) => {
  let shortUrl;

  if (slug) {
    // Check if custom slug already exists
    const exist = await getCustomShortUrl(slug);
    if (exist) {
      throw new Error("Custom URL already exists");
    }
    shortUrl = slug;
  } else {
    // Generate random short URL
    shortUrl = generateNanoId(7);
  }

  if (!shortUrl) {
    throw new Error("Failed to generate short url");
  }

  console.log("Saving URL with params:", { shortUrl, url, userId });
  await saveShortUrl(shortUrl, url, userId);

  return shortUrl;
};
