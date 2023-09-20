"use client";
import CreateGameCard from "./createGameCard";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import useWebSocket from "react-use-websocket";
import { WSMessage } from "../../model/wsTypes";
import { UserData } from "../../model/player";

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
}: {
	session: string;
	link: string;
}) {
	Cookies.set("session", session, { expires: 1 });

	const { sendMessage } = useWebSocket(
		`${process.env.NEXT_PUBLIC_WS_URL}/w` ?? "",
		{
			queryParams: {
				game: link,
				session: session,
			},
			onOpen: () => {
				const localUserData = localStorage.getItem("userData");

				const data: UserData = localUserData
					? JSON.parse(localUserData)
					: {
							username: "",
							color: "w",
							time: 10,
							increment: 2,
					  };
				sendMessage(
					JSON.stringify({
						t: "params",
						d: {
							username: data?.username ?? "",
							color: data.color,
							time: `${data.time}|${data.increment}`,
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
			<CreateGameCard
				link={link}
				inputUpdate={async (inputData) => {
					localStorage.setItem("userData", JSON.stringify(inputData));

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
			/>
			<GamesGlobe />
		</main>
	);
}
