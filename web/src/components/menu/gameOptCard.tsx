const GameOptCard = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => {
	return (
		<div className="w-full flex flex-col justify-between bg-transparent rounded-xl">
			<div className="w-full h-[20%] flex justify-center items-center bg-transparent rounded-xl">
				<h1 className="text-[#A49CD2] text-5xl font-bold py-3">
					{title}
				</h1>
			</div>
			<div className="w-[100%] h-[80%] flex justify-center items-center">
				{children}
			</div>
		</div>
	);
};

export default GameOptCard;
