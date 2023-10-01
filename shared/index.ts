import { ObjectId } from "mongodb";

export interface IUser {
	id: string;
	name: string;
	tokenVersion: number;
	githubUserId: string;
}

export interface AccessTokenPayload {
	userId: string;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
	version: number;
}

export enum Cookies {
	AccessToken = "access",
	RefreshToken = "refresh",
}

export interface AccessToken extends AccessTokenPayload {
	exp: number;
}

export interface RefreshToken extends RefreshTokenPayload {
	exp: number;
}
