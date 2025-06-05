import { verifyToken } from "./helper.js";
import { findUserById } from "../dao/user.dao.js";

export const attachuser = async (req, res, next) => {
  const token = req.cookies.accesstoken;
  if (!token) {
    return next();
  }
  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  } catch (err) {
    return next();
  }
};
