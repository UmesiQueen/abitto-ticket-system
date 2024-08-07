import axios from "axios";

const API_BASE_URL = process.env.ABITTO_BASE_URL;

const baseurl = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		//  Authorization: `<Your Auth Token>`,
		"Content-Type": "application/json",
		timeout: 10000,
	},
});

export default baseurl;
