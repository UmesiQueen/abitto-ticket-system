import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.ABITTO_BASE_URL;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		//  Authorization: `<Your Auth Token>`,
		"Content-Type": "application/json",
		timeout: 10000,
	},
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		// Return the response if it is successful
		return response;
	},
	(error) => {
		if (process.env.NODE_ENV === "development") {
			// Log detailed error information in development
			console.error("Request error:", error);
		}
		// Check if the error is a timeout error
		if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
			// Display a global error message for timeout
			toast.error("Request timed out. Please try again later.");
		}
		if (
			error.code === "ERR_NETWORK" ||
			error.code === "ERR_INTERNET_DISCONNECTED"
		) {
			// Display a global error message for timeout
			toast.error(
				"Network error. Please check your internet connection and try again."
			);
		}
		// Handle other errors
		return Promise.reject(error);
	}
);

export default axiosInstance;
