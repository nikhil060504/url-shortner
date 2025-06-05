import axiosInstance from "./axiosinstance.js";

export const loginUser = async (email, password) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    // Error is already handled by axios interceptor
    // Just re-throw it so the component can handle it
    throw error;
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/register", {
      name,
      email,
      password,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await axiosInstance.post("/api/auth/logout");
    return data;
  } catch (error) {
    throw error;
  }
};
