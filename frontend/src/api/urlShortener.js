import axiosInstance from "./axiosinstance.js";

export const shortenUrl = async (url) => {
  try {
    const { data } = await axiosInstance.post("/api/create", { url });
    return data.data; // Return the shortened URL from the data field
  } catch (error) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

export const getUserUrls = async () => {
  try {
    const { data } = await axiosInstance.get("/api/urls");
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUrl = async (urlId) => {
  try {
    const { data } = await axiosInstance.delete(`/api/urls/${urlId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
