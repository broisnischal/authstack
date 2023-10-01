import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
	server: {
		NODE_ENV: z.string(),
		TOKEN_URL: z.string(),
		MONGO_URI: z.string(),
		USER_URL: z.string(),
		CLIENT_ID: z.string(),
		CLIENT_SECRET: z.string(),
		ACCESS_SECRET: z.string(),
		REFRESH_SECRET: z.string(),
		BASE_DOMAIN: z.string(),
		CLIENT_URL: z.string(),
	},
	runtimeEnv: process.env,
});

const args = {
	// watch: process.argv.includes("--watch"),
	// liveReload: true,
};

const config = {
	...env,
	args,
};

export default config;
