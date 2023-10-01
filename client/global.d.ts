import { IUser } from "@shared";

declare global {
	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & {};

	type User = Prettify<IUser>;
}
