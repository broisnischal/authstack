import axios from "axios";
import config from "./config";

interface GitubUser {
	id: number;
	name: string;
}

interface AccessTokenResponse {
	access_token: string;
}

interface UserResponse {
	id: number;
	name: string;
}

export async function getGithubUser(code: string) {
	const token = await getAccessToken(code);
	return getUser(token);
}

async function getAccessToken(code: string) {
	const response = await axios.post<AccessTokenResponse>(
		config.TOKEN_URL,
		{
			client_id: config.CLIENT_ID,
			client_secret: config.CLIENT_SECRET,
			code,
		},
		{
			headers: {
				Accept: "application/json",
			},
		},
	);

	return response.data.access_token;
}

async function getUser(token: string) {
	const response = await axios.get<UserResponse>(config.USER_URL, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data as GitubUser;
}
