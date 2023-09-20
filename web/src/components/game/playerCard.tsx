import Clock from "./clock";

const PlayerCard = ({
	username,
	reverse,
	time,
	isWinner,
}: {
	username: string;
	reverse?: boolean;
	time: number;
	isWinner: boolean;
}) => {
	return (
		<div
			className={`rounded-xl w-full h-full flex ${
				reverse ? "flex-col-reverse" : "flex-col"
			} justify-between max-md:flex-col`}
			style={{
				background: isWinner
					? "linear-gradient(90deg, #B9B9B9 0%, rgba(56, 54, 6, 0.99) 0.01%, rgba(255, 245, 0, 0.84) 37.38%, rgba(14, 13, 0, 0.84) 112.15%), rgba(46, 71, 183, 0.08)"
					: "#13172D",
			}}
		>
			<div className="h-[20%] flex">
				<h3 className="text-center m-auto text-[#EDEDED] font-bold text-4xl lg:text-5xl">
					<Clock time={time} />
				</h3>
			</div>
			<div
				className={`mx-auto flex ${
					reverse ? "flex-col-reverse" : "flex-col"
				} max-md:flex-col`}
			>
				<h2 className="text-[#C9C9C9] text-2xl lg:text-4xl font-bold text-center">
					{username}
				</h2>
				<div className="py-8 max-md:hidden">
					<svg
						className="mx-auto w-[60%]"
						viewBox="0 0 100 100"
						fill="none"
					>
						<circle cx="50" cy="50" r="50" fill="#C9C9C9" />
					</svg>
				</div>
			</div>
		</div>
	);
};

export default PlayerCard;
