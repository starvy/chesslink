export default function Clock({ time }: { time: number }) {
	const minutes = Math.floor(time / 60_000);
	const seconds = Math.floor((time % 60_000) / 1000);
	return minutes >= 0 && seconds >= 0 ? (
		<>
			{minutes}:{seconds.toString().padStart(2, "0")}
		</>
	) : (
		<>0:00</>
	);
}
