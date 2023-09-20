import { PieceType } from "@/model/position";
import Image from "next/image";

const Piece = ({ color, type }: { color: "w" | "b"; type: PieceType }) => {
	const route = `/pieces/${type.valueOf()}${color}.svg`;
	return (
		<div className="w-full h-full relative">
			<Image draggable={false} src={route} alt={"piece"} fill />
		</div>
	);
};

export default Piece;
