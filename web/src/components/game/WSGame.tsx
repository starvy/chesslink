"use client";
import { Coords, Piece, Promotion } from "@/model/position";
import { useContext } from "react";
import useWebSocket from "react-use-websocket";
import { useSearchParams } from "next/navigation";
import { WSMessage } from "../../model/wsTypes";
import Cookies from "js-cookie";
import Game from "./game";
import { GameDispatchContext } from "@/contexts/gameContext";
import { UserData } from "../../model/player";
import { pieceMoved } from "../board/boardOverlay";

const WSGame = () => {
	const gameDispatch = useContext(GameDispatchContext);

	const searchParams = useSearchParams();

	const localUserData = localStorage.getItem("userData");
	const userData: UserData = localUserData
		? JSON.parse(localUserData)
		: {
				username: "anonymous",
				color: "w",
				time: 10,
				increment: 2,
		  };
	console.log(userData);
	const { sendMessage } = useWebSocket(
		`${process.env.NEXT_PUBLIC_WS_URL}/p`,
		{
			queryParams: {
				name: userData.username.length > 0 ? userData.username : "anonymous",
				game: searchParams.get("game")!,
				session: Cookies.get("session")!,
			},
			onMessage: (lastMessage) => {
				const msg = JSON.parse(lastMessage.data) as WSMessage;
				gameDispatch(msg);
			},
			onOpen: () => {
				console.log("WS connection opened");
				sendMessage(JSON.stringify({ t: "ready" } as WSMessage));
			},
			onError: (e) => {
				console.error(e);
				window.location.href = "/?error=ws";
			},
		},
	);

	const pieceMoved: pieceMoved = (
		selectedPiece: Piece,
		coords: Coords,
		promotion?: Promotion,
	) => {
		try {
			const san = gameDispatch({
				t: "pieceMove",
				d: {
					from: selectedPiece.coords,
					to: coords,
					promotion,
				},
			});
			sendMessage(JSON.stringify({ t: "move", d: san }));
		} catch (e) {
			console.error(e);
		}
	};

	return <Game pieceMoved={pieceMoved} sidePlaying={userData.color} />;
};

export default WSGame;
