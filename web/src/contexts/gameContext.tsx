/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	Coords,
	Position,
	Promotion,
	coordsToSquare,
	fromChess,
} from "@/model/position";
import { StatusOutcome, WSMessage } from "@/model/wsTypes";
import { Chess } from "chess.js";
import { createContext, useRef, useState } from "react";

type DispatchMsg =
	| WSMessage
	| {
			t: "pieceMove";
			d: { from: Coords; to: Coords; promotion?: Promotion };
	  };

export const GameContext = createContext<{
	timeControl: {
		time: number;
		increment: number;
	};
	position: Position;
	time: {
		w: number;
		b: number;
	};
	playingSide: "w" | "b";
	players: {
		w: string;
		b: string;
	};
	link: string;
	status: {
		status: "waiting" | "inprogress" | "ended";
		outcome: "w" | "b" | "d" | null;
	};
	history: string[];
	// @ts-ignore
}>(null);

export const GameDispatchContext =
	// @ts-ignore
	createContext<(msg: DispatchMsg) => void | string>(null);

export const GameProvider = ({
	startTime,
	link,
	children,
}: {
	playingSide: "w" | "b";
	startTime: number;
	link: string;
	children: React.ReactNode;
}) => {
	const game = useRef(new Chess());
	const [position, setPosition] = useState(fromChess(game.current));
	const [timeControl, setTimeControl] = useState({
		time: 0,
		increment: 0,
	});
	const [time, setTime] = useState({
		w: startTime,
		b: startTime,
	});
	const [players, setPlayers] = useState({
		w: "",
		b: "",
	});
	const [status, setStatus] = useState<StatusOutcome>({
		status: "waiting",
		outcome: null,
	});
	const [playingSide, setPlayingSide] = useState<"w" | "b">("w");
	const [history, setHistory] = useState<string[]>([]);

	function dispatch(msg: DispatchMsg): void | string {
		switch (msg.t) {
			case "info":
				setHistory(msg.d.h);
				setTimeControl({
					time: msg.d.t,
					increment: msg.d.i,
				});
				game.current = new Chess(msg.f);
				setPosition(fromChess(game.current));
				setPlayers({ w: msg.d.w, b: msg.d.b });
				setStatus(msg.d.s);
				break;
			case "player":
				setPlayingSide(msg.d);
				break;
			case "started":
				game.current = new Chess(msg.f);
				setPlayingSide(msg.d);
				setPosition(fromChess(game.current));
				setStatus({
					status: "inprogress",
					outcome: null,
				});
				break;
			case "pieceMove": {
				const result = game.current.move({
					from: coordsToSquare(msg.d.from),
					to: coordsToSquare(msg.d.to),
					promotion: msg.d.promotion,
				}); // TODO: error handling
				setPosition(fromChess(game.current));
				return result.san; // TODO: take a look at this (void | string)
			}
			case "moved":
				game.current = new Chess(msg.d.f);
				setTime(msg.d.t);
				setPosition(fromChess(game.current));
				setHistory((history) => [...history, msg.d.m]);
				break;
			case "gamefull":
				game.current = new Chess(msg.f);
				setPlayers(msg.d);
				setPosition(fromChess(game.current));
				setHistory(msg.d.h);
				break;
			case "resign":
				setStatus(msg.d);
				break;
			case "gameover":
				setStatus(msg.d);
				break;
			case "e":
				game.current = new Chess(msg.d);
				setPosition(fromChess(game.current));
				break;
			case "sync":
				setTime(msg.d);
				break;
		}
	}

	return (
		<GameContext.Provider
			value={{
				position,
				time,
				playingSide,
				players,
				link,
				status,
				history,
				timeControl,
			}}
		>
			<GameDispatchContext.Provider value={dispatch}>
				{children}
			</GameDispatchContext.Provider>
		</GameContext.Provider>
	);
};
