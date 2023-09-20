import { Chess, Square } from "chess.js";

export enum Color {
	White,
	Black,
}

export enum PieceType {
	Pawn,
	Knight,
	Bishop,
	Rook,
	Queen,
	King,
}

export interface Coords {
	x: number;
	y: number;
}

export interface RelativeCoords extends Coords {
	c: "w" | "b";
}

export interface Piece {
	color: "w" | "b";
	type: PieceType;
	coords: Coords;
}

export interface Move {
	piece: Piece;
	to: Coords;
}

export interface Position {
	pieces: Piece[];
	moves: Move[];
	sideToMove: "w" | "b";
}

export type Promotion = "q" | "r" | "b" | "n";

export const squareToCoords = (square: string): Coords => {
	const x = square.charCodeAt(0) - 97;
	const y = 8 - parseInt(square.charAt(1));
	return { x, y };
};

export const coordsToSquare = (coords: Coords): Square => {
	const x = String.fromCharCode(97 + coords.x);
	const y = String(8 - coords.y);
	return (x + y) as Square;
};

const pieceFromSymbol = (symbol: "p" | Promotion | "k"): PieceType => {
	switch (symbol) {
		case "p":
			return PieceType.Pawn;
		case "n":
			return PieceType.Knight;
		case "b":
			return PieceType.Bishop;
		case "r":
			return PieceType.Rook;
		case "q":
			return PieceType.Queen;
		case "k":
			return PieceType.King;
	}
};

export const fromChess = (chess: Chess): Position => {
	return {
		pieces: chess
			.board()
			.flat()
			.filter((p) => p !== null)
			.map((p) => {
				return {
					coords: squareToCoords(p!.square),
					color: p!.color,
					type: pieceFromSymbol(p!.type),
				} as Piece;
			}),
		moves: chess.moves({ verbose: true }).map((move) => {
			const type = pieceFromSymbol(move.piece);
			const color = move.color;
			const coords = squareToCoords(move.from);
			const to = squareToCoords(move.to);

			return {
				piece: {
					type,
					color,
					coords,
				},
				to,
			} as Move;
		}),
		sideToMove: chess.turn(),
	};
};

export const startpos = (): Position => {
	const chess = new Chess();
	return fromChess(chess);
};
