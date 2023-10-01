import { AccessToken } from "@shared";

declare global {
	namespace Express {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		interface Locals extends Record<string, any> {
			token: AccessToken;
		}
		interface Response {
			locals: Locals;
		}
	}
}
