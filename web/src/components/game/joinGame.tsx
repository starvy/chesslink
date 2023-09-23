"use client";
import Cookies from "js-cookie";
import WSGame from "./WSGame";
import { GameProvider } from "@/contexts/gameContext";
import { useSearchParams } from "next/navigation";
import { UserData } from "@/model/player";

const JoinGame = ({
	session,
	userData,
}: {
	session: string;
	userData: UserData;
}) => {
	Cookies.set("session", session, { expires: 1 });
	const searchParams = useSearchParams();
	return (
		<GameProvider
			startTime={60_000}
			playingSide={searchParams.get("color")! as "w" | "b"}
			link={searchParams.get("game")!}
		>
			<WSGame userData={userData} />
		</GameProvider>
	);
};

export default JoinGame;
