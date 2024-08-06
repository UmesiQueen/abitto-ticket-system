import axios from "axios";

const API_BASE_URL = import.meta.env.DEV
	? import.meta.env.VITE_ABITTO_BASE_URL
	: process.env.ABITTO_BASE_URL;

console.log(import.meta);

const baseurl = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		//  Authorization: `<Your Auth Token>`,
		"Content-Type": "application/json",
		timeout: 1000,
	},
	// .. other options
});

export default baseurl;
