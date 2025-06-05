import { verifyToken } from "../utils/helper.js";
import { UnauthorizedError } from "../utils/errorHandler.js";
import { findUserById } from "../dao/user.dao.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookies first, then Authorization header
    let token = req.cookies.accesstoken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      throw new UnauthorizedError("Access token required");
    }

    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id || decoded.userId || decoded);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    throw new UnauthorizedError("Invalid or expired token");
  }
};
