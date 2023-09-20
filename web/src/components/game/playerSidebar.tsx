import PlayerCard from "./playerCard";
import { GameContext } from "@/contexts/gameContext";
import { useContext } from "react";

const toPlayer = (username: string, time: number) => {
	return { username, time };
};

const PlayerPanel = () => {
	const game = useContext(GameContext);
	const [player, opponent] = [
		toPlayer(game.players.w, game.time.w),
		toPlayer(game.players.b, game.time.b),
	].sort(() => (game.playingSide === "w" ? -1 : 1));
	return (
		<div className="w-full h-full grid max-md:grid-rows-1 max-md:grid-cols-2 md:grid-rows-2 md:grid-cols-1 gap-6">
			<div className="w-full h-full">
				<PlayerCard
					username={opponent.username}
					time={opponent.time}
					isWinner={
						game.status.outcome ===
						(game.playingSide === "w" ? "b" : "w")
					}
				/>
			</div>
			<div className="w-full h-full">
				<PlayerCard
					username={player.username}
					reverse={true}
					time={player.time}
					isWinner={game.status.outcome === game.playingSide}
				/>
			</div>
		</div>
	);
};

export default PlayerPanel;
