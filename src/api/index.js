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

// // Variable to store the cancel token of the last request
// let cancelTokenSource = null;

// // Add a request interceptor to handle cancel tokens
// axiosInstance.interceptors.request.use((config) => {
// 	// Cancel the previous request if there is one
// 	if (cancelTokenSource) {
// 		cancelTokenSource.cancel('Request canceled due to new request.');
// 	}

// 	// Create a new cancel token for the current request
// 	cancelTokenSource = axios.CancelToken.source();

// 	// Attach the cancel token to the request config
// 	config.cancelToken = cancelTokenSource.token;

// 	return config;
// }, (error) => {
// 	// Handle other errors
// 	return Promise.reject(error);
// });

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
