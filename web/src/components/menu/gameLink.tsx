import { textGradient } from "@/utils/gradient";

const GameLink = ({
	link,
	timeInput,
	incrementInput,
	copyIcon = true,
}: {
	link: string;
	timeInput: number;
	incrementInput: number;
	copyIcon?: boolean;
}) => {
	const gameLink = `chessl.ink/${link}`;
	return (
		<div className="flex flex-col items-center w-full">
			<div className="flex align-middle">
				<h1
					style={textGradient(
						"linear-gradient(90deg, #DBB9EB 0%, #3E5EED 100%)",
					)}
					className="text-5xl 2xl:text-6xl text-center font-semibold"
				>
					{gameLink}
				</h1>
				{copyIcon ? (
					<svg
						className="ml-2 hover:cursor-pointer w-12 h-12 2xl:w-16 2xl:h-16"
						onClick={() => {
							navigator.clipboard.writeText(
								`https://${gameLink}`,
							);
						}}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 59 57"
						fill="none"
					>
						<path
							d="M11.0625 52.1907C10.0792 52.1907 9.21875 51.8344 8.48125 51.1219C7.74375 50.4094 7.375 49.5782 7.375 48.6282V12.825H11.0625V48.6282H40.1938V52.1907H11.0625ZM18.4375 45.0657C17.4542 45.0657 16.5938 44.7094 15.8562 43.9969C15.1188 43.2844 14.75 42.4532 14.75 41.5032V8.25317C14.75 7.30317 15.1188 6.47192 15.8562 5.75942C16.5938 5.04692 17.4542 4.69067 18.4375 4.69067H45.4792C46.4625 4.69067 47.3229 5.04692 48.0604 5.75942C48.7979 6.47192 49.1667 7.30317 49.1667 8.25317V41.5032C49.1667 42.4532 48.7979 43.2844 48.0604 43.9969C47.3229 44.7094 46.4625 45.0657 45.4792 45.0657H18.4375ZM18.4375 41.5032H45.4792V8.25317H18.4375V41.5032Z"
							fill="#A9A9A9"
						/>
					</svg>
				) : (
					<></>
				)}
			</div>
			<h2 className="text-2xl text-center text-[#626262] mt-4 w-full">
				Standard | {timeInput} min | {incrementInput} s increment
			</h2>
		</div>
	);
};

export default GameLink;
