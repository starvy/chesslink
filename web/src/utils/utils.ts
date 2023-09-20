import { Coords, PieceType, RelativeCoords } from "@/model/position";
import { CSSProperties } from "react";

const coordScalarX = 12.5;
const coordScalarY = 12.5;

export const calculateCSSPosition = (coords: Coords): CSSProperties => {
	const x = coords.x * coordScalarX;
	const y = coords.y * coordScalarY;
	return { left: `${x}%`, top: `${y}%` };
};

export const relativeCoords = (
	coords: Coords,
	color: "w" | "b",
): RelativeCoords => {
	if (color === "w") {
		return {
			x: coords.x,
			y: coords.y,
			c: "w",
		};
	} else {
		return { x: 7 - coords.x, y: 7 - coords.y, c: "b" };
	}
};

export const isPromotion = (
	pieceType: PieceType,
	coords: Coords,
	side: "w" | "b",
): boolean => {
	if (pieceType !== PieceType.Pawn) return false;
	const promotionRank = side === "w" ? 0 : 7;
	return coords.y === promotionRank;
};
