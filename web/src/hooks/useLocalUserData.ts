import { DEFAULT_USER_DATA, UserData } from "@/model/player";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useLocalUserData = (
	initialValue: UserData = DEFAULT_USER_DATA,
): [UserData, Dispatch<SetStateAction<UserData>>] => {
	const [value, setValue] = useState<UserData>(initialValue);

	useEffect(() => {
		Cookies.set("userData", JSON.stringify(value));
	}, [value]);

	return [value, setValue];
};

export default useLocalUserData;
