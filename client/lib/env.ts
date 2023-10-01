export const environment = {
	isProduction: process.env.NODE_ENV === "production",
	githubClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
	githubRedirectUrl: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URL,
	apiURL: process.env.NEXT_PUBLIC_API_URL,
	baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN,
};
