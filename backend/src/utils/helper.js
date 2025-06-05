import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { findUserById } from "../dao/user.dao.js";
export const generateNanoId = (length) => {
  return nanoid(length);
};

export const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // JWT options, not cookie options
  );
};

export const verifyToken = (token) => {
  const decoded =  jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};
