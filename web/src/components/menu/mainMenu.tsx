"use client";
import CreateGameCard from "./createGameCard";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import useWebSocket from "react-use-websocket";
import { WSMessage } from "../../model/wsTypes";
import { UserData } from "../../model/player";
import useLocalUserData from "@/hooks/useLocalUserData";

const GamesGlobe = dynamic(
	() => {
		return import("./gamesGlobe");
	},
	{
		ssr: false,
		loading: () => (
			<div
				style={{
					width: "100vh",
					backgroundImage: "url(/images/loadingGlobe2.png)",
					backgroundSize: "cover",
					height: "100vh",
				}}
			></div>
		),
	},
);

export default function MainMenu({
	session,
	link,
	initialUserData,
}: {
	session: string;
	link: string;
	initialUserData: UserData;
}) {
	const [userData, setUserData] = useLocalUserData(initialUserData);
	Cookies.set("session", session, { expires: 1 });

	const { sendMessage } = useWebSocket(
		`${process.env.NEXT_PUBLIC_WS_URL}/w` ?? "",
		{
			queryParams: {
				game: link,
				session: session,
			},
			onOpen: () => {
				sendMessage(
					JSON.stringify({
						t: "params",
						d: {
							username: userData?.username ?? "",
							color: userData.color,
							time: `${userData.time}|${userData.increment}`,
						},
					}),
				);
			},
			onMessage: (lastMessage) => {
				const msg = JSON.parse(lastMessage.data) as WSMessage;
				if (msg.t === "gamefull") {
					window.location.href = `/play?game=${link}`;
				}
			},
		},
	);

	return (
		<main className="flex h-screen justify-between bg-[#080808]">
			<div className="max-xl:mx-auto max-xl:w-[38%] ml-6 2xl:ml-20">
				<CreateGameCard
					link={link}
					inputUpdate={async (inputData) => {
						setUserData(inputData);
						sendMessage(
							JSON.stringify({
								t: "params",
								d: {
									username: inputData.username,
									color: inputData.color,
									time: `${inputData.time}|${inputData.increment}`,
								},
							}),
						);
					}}
					userData={userData}
				/>
			</div>
			<div className={"hidden xl:block max-xl:w-[62%]"}>
				<GamesGlobe />
			</div>
		</main>
	);
}
