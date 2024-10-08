import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), "");

	return {
		// vite config
		plugins: [react()],
		resolve: {
			// eslint-disable-next-line no-undef
			alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
		},
		define: {
			"process.env.ABITTO_BASE_URL": JSON.stringify(env.ABITTO_BASE_URL),
		},
	};
});
