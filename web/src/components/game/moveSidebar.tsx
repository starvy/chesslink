import { GameContext } from "@/contexts/gameContext";
import { useContext, useEffect, useRef } from "react";
import OfferDrawIcon from "../icons/drawIcon";
import ResignIcon from "../icons/resignIcon";
import { textGradient } from "@/utils/gradient";

const MovePanel = () => {
	const historyRef = useRef(null);
	const game = useContext(GameContext);

	function scrollHistoryBottom() {
		if (!historyRef.current) return;
		const historyDiv = historyRef.current as HTMLDivElement;
		historyDiv.scrollTop = historyDiv.scrollHeight;
	}

	useEffect(() => {
		window.onresize = scrollHistoryBottom;
	}, []);
	useEffect(() => {
		scrollHistoryBottom();
	}, [game.history]);
	return (
		<div className="w-full h-full bg-[#13172D] rounded-xl flex flex-col">
			<div className="py-8 2xl:py-12 bg-[#181540] rounded-xl">
				<h1
					className="text-center font-bold text-3xl 2xl:text-5xl text-transparent"
					style={textGradient(
						"linear-gradient(90deg, #DBB9EB 0%, #3E5EED 100%)",
					)}
				>
					chessl.ink/{game.link}
				</h1>
				<h3 className="text-[#626262] text-lg 2xl:text-2xl mt-4 text-center">
					Standard | {game.timeControl.time / 60_000} min |{" "}
					{game.timeControl.increment / 1000}s
				</h3>
			</div>
			<div className="flex flex-row-reverse py-4 px-4">
				<div className="px-2 hover:cursor-pointer">
					<OfferDrawIcon />
				</div>
				<div className="px-2 hover:cursor-pointer">
					<ResignIcon />
				</div>
			</div>
			<div
				ref={historyRef}
				className="flex flex-wrap mt-6 px-2 2xl:px-4 overflow-y-auto"
			>
				{game.history.map((move, i) => (
					<div
						key={`history${i}`}
						className="bg-[#1F1840] rounded-md w-16 2xl:w-24 p-1 m-2 flex"
					>
						<span className="text-[#B3B3B3] font-semibold text-sm 2xl:text-base text-center m-auto">
							{i + 1}.{move}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default MovePanel;
