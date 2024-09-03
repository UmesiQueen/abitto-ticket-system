import { defineConfig, loadEnv, normalizePath } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cMapsDir = normalizePath(
	path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps'),
);
const standardFontsDir = normalizePath(
	path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts'),
);

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), "");

	return {
		// vite config
		plugins: [react(), viteStaticCopy({
			targets: [
				{ src: cMapsDir, dest: '' },
				{ src: standardFontsDir, dest: '' },
			],
		}),
		],
		resolve: {
			// eslint-disable-next-line no-undef
			alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
		},
		define: {
			"process.env.ABITTO_BASE_URL": JSON.stringify(env.ABITTO_BASE_URL),
		},
	};
});
