export const DEFAULT_USER_DATA: UserData = {
	color: "w",
	username: "",
	time: 10,
	increment: 2,
};

export interface Player {
	username: string;
	img: string;
}

export interface UserData {
	time: number;
	increment: number;
	username: string;
	color: "w" | "b";
}
