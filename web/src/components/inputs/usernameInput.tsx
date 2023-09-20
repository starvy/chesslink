"use client";
import { useState } from "react";
import { UserData } from "../../model/player";

const UsernameInput = ({ link }: { link: string }) => {
	function getUsername(): string {
		// TODO: React Context for userData
		if (typeof window === "undefined") return "";
		const localUserData = localStorage.getItem("userData");
		if (!localUserData) return "";
		const userData: UserData = JSON.parse(localUserData);
		return userData.username;
	}

	const [usernameInput, setUsernameInput] = useState(getUsername());

	function startGame() {
		localStorage.setItem(
			"userData",
			JSON.stringify({
				username: usernameInput,
			}),
		);
		window.location.href = `/play?game=${link}`;
	}
	return (
		<>
			<input
				type="text"
				className="w-[70%] border-[#597BF533] border-2 bg-transparent rounded-xl text-[#A49CD2] text-2xl p-4"
				placeholder="Username"
				defaultValue={usernameInput}
				onChange={(e) => setUsernameInput(e.currentTarget.value)}
				onKeyDown={(e) => e.key === "Enter" && startGame()}
			/>
			<button
				onClick={() => startGame()}
				className="bg-[#CDCDCD] ml-4 p-4 text-black font-bold text-2xl rounded-xl w-[30%]"
			>
				Join now
			</button>
		</>
	);
};

export default UsernameInput;
