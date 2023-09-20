import {
	Coords,
	Piece as PieceInterface,
	Position,
	Promotion,
} from "@/model/position";
import Piece from "./piece";
import {
	calculateCSSPosition,
	isPromotion,
	relativeCoords,
} from "@/utils/utils";
import { useState } from "react";
import PromotionOverlay from "./promotionOverlay";

export type pieceMoved = (
	selectedPiece: PieceInterface,
	coords: Coords,
	promotion?: Promotion,
) => void;

const BoardOverlay = ({
	position,
	pieceMoved,
	sidePlaying,
}: {
	position: Position;
	pieceMoved: pieceMoved;
	sidePlaying: "w" | "b";
}) => {
	const [next, setNext] = useState<{
		selectedPiece: PieceInterface | null;
		moves: Coords[];
	}>({
		selectedPiece: null,
		moves: [],
	});
	// TODO: useEffect instead of this?
	const [mousePos, setMousePos] = useState<Coords | null>(null);
	const [dragging, setDragging] = useState<PieceInterface | null>(null);
	const [promote, setPromote] = useState<Coords | null>(null);

	const pieceClicked = (piece: PieceInterface) => {
		if (sidePlaying !== piece.color) return;
		const moves = position.moves
			.filter(
				(move) =>
					move.piece.coords.x === piece.coords.x &&
					move.piece.coords.y === piece.coords.y,
			)
			.map((move) => move.to);
		setNext({ selectedPiece: piece, moves: moves });
	};

	const moveClicked = (coords: Coords) => {
		if (!next.selectedPiece) return;
		if (isPromotion(next.selectedPiece.type, coords, sidePlaying)) {
			setPromote(coords);
			return;
		}
		pieceMoved(next.selectedPiece, coords);
		setNext({
			selectedPiece: null,
			moves: [],
		});
	};

	const promoteClicked = (promotion: Promotion) => {
		pieceMoved(next.selectedPiece!, promote!, promotion);
		setNext({
			selectedPiece: null,
			moves: [],
		});
		setPromote(null);
	};

	const mouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePos({
			x: ((e.clientX - rect.left) / rect.width) * 8,
			y: ((e.clientY - rect.top) / rect.height) * 8,
		});
	};

	const dragStart = (piece: PieceInterface) => {
		if (position.sideToMove !== piece.color || sidePlaying !== piece.color)
			return;
		pieceClicked(piece);
		setDragging(piece);
		document.body.style.cursor = "grabbing";
	};

	const dragEnd = () => {
		if (dragging && mousePos) {
			const rCoords = relativeCoords(
				{
					x: Math.floor(mousePos.x),
					y: Math.floor(mousePos.y),
				},
				sidePlaying,
			);
			if (
				next.moves.some(
					(move) => move.x === rCoords.x && move.y === rCoords.y,
				)
			) {
				moveClicked(rCoords);
			}
		}
		setDragging(null);
		document.body.style.cursor = "default";
	};

	const movesDisplay = next.moves.map((coords, i) => {
		const rCoords = relativeCoords(coords, sidePlaying);
		const coordsCSS = calculateCSSPosition(rCoords);
		return (
			<div
				key={`nextMove${rCoords.x}${rCoords.y}${i}`}
				onClick={() => moveClicked(coords)}
				className={"absolute flex w-[12.5%] h-[12.5%]"}
				style={coordsCSS}
			>
				<svg className={"opacity-30"}>
					<circle cx="50%" cy="50%" r="20%" fill="black" />
				</svg>
			</div>
		);
	});

	const pieces = position.pieces
		.filter(
			(piece) =>
				dragging?.coords.x !== piece.coords.x ||
				dragging?.coords.y !== piece.coords.y,
		)
		.map((piece, i) => {
			const rCoords = relativeCoords(piece.coords, sidePlaying);
			const coordsCSS = calculateCSSPosition(rCoords);
			return (
				<div
					key={`piece${i}`}
					className={
						"absolute flex w-[12.5%] h-[12.5%] hover:cursor-grab"
					}
					onDragStart={(e) => e.preventDefault()}
					onMouseDown={() => dragStart(piece)}
					style={coordsCSS}
				>
					<div className="w-full h-full m-auto">
						<Piece color={piece.color} type={piece.type} />
					</div>
				</div>
			);
		});

	const draggingPiece = dragging ? (
		<div
			className="absolute flex w-[12.5%] h-[12.5%]"
			style={
				mousePos
					? calculateCSSPosition(
							relativeCoords(
								{
									x: mousePos.x - 0.5,
									y: mousePos.y - 0.5,
								},
								"w",
							),
					  )
					: { display: "none" }
			}
		>
			<div className="w-full h-full m-auto">
				<Piece color={dragging.color} type={dragging.type} />
			</div>
		</div>
	) : null;

	return (
		<div
			className="relative w-full h-full"
			onMouseMove={mouseMove}
			onMouseUp={dragEnd}
			onMouseDown={() => setPromote(null)}
		>
			{pieces} {movesDisplay} {draggingPiece}{" "}
			{promote && (
				<PromotionOverlay
					coords={promote}
					side={sidePlaying}
					promoted={promoteClicked}
				/>
			)}
		</div>
	);
};

export default BoardOverlay;
