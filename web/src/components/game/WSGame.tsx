"use client";
import { Coords, Piece, Promotion } from "@/model/position";
import { useContext } from "react";
import useWebSocket from "react-use-websocket";
import { useSearchParams } from "next/navigation";
import { WSMessage } from "../../model/wsTypes";
import Cookies from "js-cookie";
import Game from "./game";
import { GameContext, GameDispatchContext } from "@/contexts/gameContext";
import { pieceMoved } from "../board/boardOverlay";
import useLocalUserData from "@/hooks/useLocalUserData";

const WSGame = () => {
	const gameDispatch = useContext(GameDispatchContext);
	const gameContext = useContext(GameContext);

	const searchParams = useSearchParams();

	const [userData] = useLocalUserData();
	console.log(userData);
	const { sendMessage } = useWebSocket(
		`${process.env.NEXT_PUBLIC_WS_URL}/p`,
		{
			queryParams: {
				name:
					userData.username.length > 0
						? userData.username
						: "anonymous",
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
				window.location.href = `/?error=${gameContext.exitReason}`;
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
