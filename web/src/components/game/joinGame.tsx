"use client";
import Cookies from "js-cookie";
import WSGame from "./WSGame";
import { GameProvider } from "@/contexts/gameContext";
import { useSearchParams } from "next/navigation";

const JoinGame = ({ session }: { session: string }) => {
	Cookies.set("session", session, { expires: 1 });
	const searchParams = useSearchParams();
	return (
		<GameProvider
			startTime={60_000}
			playingSide={searchParams.get("color")! as "w" | "b"}
			link={searchParams.get("game")!}
		>
			<WSGame />
		</GameProvider>
	);
};

export default JoinGame;
