import User from "./user.model";

export async function getUserByGithubId(githubId: string) {
	const user = await User.findOne({ githubUserId: githubId });
	return user;
}
