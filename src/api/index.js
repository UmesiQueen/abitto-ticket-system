/* eslint-disable no-undef */
import axios from "axios";

const API_BASE_URL = process.env.ABITTO_BASE_URL;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		//  Authorization: `<Your Auth Token>`,
		"Content-Type": "application/json",
	},
	// timeout: 500000
});

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (process.env.NODE_ENV === "development") {
			// Log detailed error information in development
			console.error("Request error:", error);
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
