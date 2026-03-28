import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	root: path.resolve(__dirname, "demo"),
	publicDir: false,
	resolve: {
		alias: {
			"format-converter": path.resolve(__dirname, "src/index.js"),
		},
	},
	build: {
		outDir: path.resolve(__dirname, "demo/dist"),
		emptyOutDir: true,
	},
});
