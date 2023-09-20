import Grid from "./grid";
import React from "react";
import { Position } from "@/model/position";
import BoardOverlay, { pieceMoved } from "@/components/board/boardOverlay";

const Board = ({
	position,
	pieceMoved,
	sidePlaying,
}: {
	position: Position;
	pieceMoved: pieceMoved;
	sidePlaying: "w" | "b";
}) => {
	return (
		<div className="relative w-full h-full select-none">
			<div>
				<Grid size={8} />
			</div>
			<div className="pieces absolute z-20 w-full h-full">
				<BoardOverlay
					position={position}
					pieceMoved={pieceMoved}
					sidePlaying={sidePlaying}
				/>
			</div>
		</div>
	);
};
export default Board;
