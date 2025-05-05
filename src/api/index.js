/* eslint-disable no-undef */
import axios from "axios";

const API_BASE_URL = process.env.ABITTO_BASE_URL;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		//  Authorization: `<Your Auth Token>`,
		"Content-Type": "application/json",
	},
	timeout: 5 * 60 * 1000 // 5 mins
});

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		// Get the original request configuration
		const originalRequest = error.config;

		// Handle timeout errors specifically
		if (error.code === 'ECONNABORTED') {
			return Promise.reject(new Error('Request timed out after 5 minutes. Please try again later.'));
		}

		// Check if the request has been retried already
		const retryCount = originalRequest._retryCount || 0;

		// Only retry GET requests that haven't been retried yet (limit to 1 retry)
		if (
			originalRequest &&
			originalRequest.method === 'get' &&
			retryCount < 1
		) {
			// Increment the retry count
			originalRequest._retryCount = retryCount + 1;

			console.log(`Request to ${originalRequest.url} failed. Retry attempt ${retryCount + 1}/1`);

			// Retry the request
			try {
				return await axiosInstance(originalRequest);
			} catch (retryError) {
				// If the retry also fails, log and return the error
				if (process.env.NODE_ENV === "development") {
					console.error("Retry request failed:", retryError);
				}
				return Promise.reject(retryError);
			}
		}

		// For non-GET requests or already retried requests, reject with the error
		if (process.env.NODE_ENV === "development") {
			// Log detailed error information in development
			console.error("Request error:", error);
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
