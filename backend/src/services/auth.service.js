import { findUserByEmail, createUser } from "../dao/user.dao.js";
import {
  ConflictError,
  BadRequestError,
  UnauthorizedError,
} from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";

export const registerUser = async (name, email, password) => {
  // Validate input
  if (!name || !email || !password) {
    throw new BadRequestError("Name, email, and password are required");
  }

  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError("User already exists with this email");
  }

  // Create new user
  const newUser = await createUser(name, email, password);
  if (!newUser) {
    throw new Error("Failed to create user");
  }

  // Generate token
  const token = signToken(newUser._id);
  return token;
};

export const loginUser = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Check password (Note: In production, use bcrypt for password hashing)
  if (user.password !== password) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Generate token
  const token = signToken(user._id);
  return { token, user };
};
