import { UserData } from "@/model/player";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const DEFAULT_USER_DATA: UserData = {
	color: "w",
	username: "anonymous",
	time: 10,
	increment: 2,
};

const useLocalUserData = (): [UserData, Dispatch<SetStateAction<UserData>>] => {
	const [value, setValue] = useState<UserData>(() => {
		const userData =
			typeof window !== "undefined"
				? localStorage.getItem("userData")
				: null;
		return userData ? JSON.parse(userData) : DEFAULT_USER_DATA;
	});

	useEffect(() => {
		localStorage.setItem("userData", JSON.stringify(value));
	}, [value]);

	return [value, setValue];
};

export default useLocalUserData;
