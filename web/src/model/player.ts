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
