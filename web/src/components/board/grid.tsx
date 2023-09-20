const Square = ({ isDark }: { isDark: boolean }) => {
	const css = `square ${isDark ? "bg-mochabrown" : "bg-palebrown"}`;
	return <div className={css}></div>;
};

const Grid = ({ size }: { size: number }) => {
	const squares = Array(size * size)
		.fill(null)
		.map((_, i) => {
			const isDark = (i + Math.floor(i / size)) % 2 === 1;
			return <Square key={`sq${i}`} isDark={isDark} />;
		});

	return (
		<div
			className={
				"absolute z-10 grid grid-rows-[8] grid-cols-8 h-full w-full rounded-xl"
			}
		>
			{squares}
		</div>
	);
};

export default Grid;
