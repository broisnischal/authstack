import mongose, { Model } from "mongoose";
import { IUser } from "@shared";

const userSchema = new mongose.Schema<IUser>({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	tokenVersion: {
		type: Number,
		default: 0,
	},
	githubUserId: {
		type: String,
		required: true,
	},
});

const User: Model<IUser> = mongose.model<IUser>("User", userSchema);

export default User;
