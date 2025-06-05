// Utility functions for error handling

/**
 * Extract user-friendly error message from error object
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again.";
};

/**
 * Check if error is a network error
 * @param {Error} error - The error object
 * @returns {boolean} - True if it's a network error
 */
export const isNetworkError = (error) => {
  return !error?.response && error?.request;
};

/**
 * Check if error is a server error (5xx)
 * @param {Error} error - The error object
 * @returns {boolean} - True if it's a server error
 */
export const isServerError = (error) => {
  return error?.response?.status >= 500;
};

/**
 * Check if error is a client error (4xx)
 * @param {Error} error - The error object
 * @returns {boolean} - True if it's a client error
 */
export const isClientError = (error) => {
  const status = error?.response?.status;
  return status >= 400 && status < 500;
};

/**
 * Get error type for better error handling
 * @param {Error} error - The error object
 * @returns {string} - Error type: 'network', 'server', 'client', 'unknown'
 */
export const getErrorType = (error) => {
  if (isNetworkError(error)) return 'network';
  if (isServerError(error)) return 'server';
  if (isClientError(error)) return 'client';
  return 'unknown';
};

/**
 * Show user-friendly error notification
 * @param {Error} error - The error object
 * @param {Function} showNotification - Function to show notification
 */
export const handleApiError = (error, showNotification) => {
  const message = getErrorMessage(error);
  const type = getErrorType(error);
  
  // You can customize this based on your notification system
  if (showNotification) {
    showNotification({
      type: 'error',
      message,
      duration: type === 'network' ? 5000 : 3000
    });
  }
  
  console.error(`[${type.toUpperCase()} ERROR]:`, message);
};

/**
 * Retry function for failed requests
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} - Promise that resolves when function succeeds or all retries fail
 */
export const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (isNetworkError(error) || isServerError(error))) {
      console.log(`Retrying request... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 1.5); // Exponential backoff
    }
    throw error;
  }
};
