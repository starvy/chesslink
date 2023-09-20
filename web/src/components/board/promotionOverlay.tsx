import { calculateCSSPosition, relativeCoords } from "@/utils/utils";
import { Coords, Promotion } from "../../model/position";

const PIECE_SYMBOLS: string[] = ["p", "n", "b", "r", "q", "k"];
const PromotionOverlay = ({
	coords,
	side,
	promoted,
}: {
	coords: Coords;
	side: "w" | "b";
	promoted: (promotion: Promotion) => void;
}) => {
	const pieces = [4, 3, 2, 1].map((p) => {
		return (
			<div
				key={`promo${p}`}
				className={"w-full h-full relative"}
				onClick={() => promoted(PIECE_SYMBOLS[p] as Promotion)}
				onMouseDown={(e) => e.stopPropagation()}
			>
				<img
					src={`/pieces/${p}${side}.svg`}
					alt={"piece"}
					className={"w-full h-full hover:cursor-pointer"}
				/>
			</div>
		);
	});
	const coordsCSS = calculateCSSPosition(relativeCoords(coords, side));
	return (
		<div
			className={"absolute flex flex-col w-[12.5%] h-[50%] bg-gray-500"}
			style={coordsCSS}
		>
			{pieces}
		</div>
	);
};

export default PromotionOverlay;
