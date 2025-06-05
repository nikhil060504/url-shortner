// axios ka instance banao
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000, // Increased timeout to 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - runs before every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      }
    } catch (error) {
      console.warn("Could not add auth token:", error);
    }

    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
axiosInstance.interceptors.response.use(
  (response) => {
    // Success response
    console.log(
      `✅ Success: ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    );
    return response;
  },
  (error) => {
    // Error response
    console.error("❌ API Error:", error);

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error("Bad Request:", data.message || "Invalid request");
          throw new Error(
            data.message || "Invalid request. Please check your input."
          );

        case 401:
          console.error(
            "Unauthorized:",
            data.message || "Authentication required"
          );
          throw new Error("Authentication required. Please log in.");

        case 403:
          console.error("Forbidden:", data.message || "Access denied");
          throw new Error("Access denied. You don't have permission.");

        case 404:
          console.error("Not Found:", data.message || "Resource not found");
          throw new Error("Resource not found. Please check the URL.");

        case 429:
          console.error(
            "Too Many Requests:",
            data.message || "Rate limit exceeded"
          );
          throw new Error("Too many requests. Please try again later.");

        case 500:
          console.error(
            "Server Error:",
            data.message || "Internal server error"
          );
          throw new Error("Server error. Please try again later.");

        case 502:
        case 503:
        case 504:
          console.error(
            "Service Unavailable:",
            data.message || "Service temporarily unavailable"
          );
          throw new Error(
            "Service temporarily unavailable. Please try again later."
          );

        default:
          console.error(`HTTP ${status}:`, data.message || "An error occurred");
          throw new Error(data.message || `An error occurred (${status})`);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("Network Error:", error.message);

      if (error.code === "ECONNABORTED") {
        throw new Error(
          "Request timeout. Please check your internet connection and try again."
        );
      } else if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Network error. Please check if the server is running and try again."
        );
      } else {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
    } else {
      // Something else happened
      console.error("Unexpected Error:", error.message);
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
);

export default axiosInstance;
