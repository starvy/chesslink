import PlayerPanel from "./playerSidebar";
import Board from "../board/board";
import MovePanel from "./moveSidebar";
import { useContext } from "react";
import { GameContext } from "@/contexts/gameContext";
import { pieceMoved } from "../board/boardOverlay";

const Game = ({
	pieceMoved,
}: {
	pieceMoved: pieceMoved;
	sidePlaying: "w" | "b";
}) => {
	const game = useContext(GameContext);
	return (
		<div className="flex max-md:flex-col h-full">
			<div className="min-w-[15%] h-full">
				<div className="h-full">
					<PlayerPanel />
				</div>
			</div>
			<div className="max-md:min-w-[95vw] max-md:min-h-[95vw] md:min-w-[95vh] md:min-h-[95vh] max-md:my-2 md:mx-4 2xl:mx-6">
				<Board
					position={game.position}
					pieceMoved={pieceMoved}
					sidePlaying={game.playingSide}
				/>
			</div>
			<div className="w-full">
				<MovePanel />
			</div>
		</div>
	);
};

export default Game;
