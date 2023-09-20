"use client";
import GameOptCard from "./gameOptCard";
import GameLink from "@/components/menu/gameLink";
import Slider from "@/components/inputs/slider";
import { useRef, useState } from "react";
import { UserData } from "../../model/player";

const CreateGameCard = ({
	link,
	inputUpdate,
}: {
	link: string;
	inputUpdate: ({ time, increment, username }: UserData) => void;
}) => {
	const localUserData = localStorage.getItem("userData");
	const userData: UserData = localUserData
		? JSON.parse(localUserData)
		: {
				name: "anonymous",
				color: "w",
				time: 10,
				increment: 2,
		  };
	const [timeInput, setTimeInput] = useState<number>(userData.time ?? 10);
	const [incrementInput, setIncrementInput] = useState<number>(
		userData.increment ?? 2,
	);
	const [usernameInput, setUsernameInput] = useState<string>(
		userData.username ?? "",
	);
	const colorRef = useRef(userData.color ?? "w");

	function update() {
		inputUpdate({
			time: timeInput,
			increment: incrementInput,
			username: usernameInput,
			color: colorRef.current,
		});
	}

	return (
		<div className="w-full h-full flex max-w-[100vh]">
			<div className="m-auto w-[70%] bg-transparent h-[90%] rounded-3xl px-8 py-16">
				<GameOptCard title="Time control">
					<div className="w-[80%] flex flex-col p-4">
						<div className="flex">
							<Slider
								min={1}
								max={30}
								defaultValue={[timeInput]}
								onValueChange={(value) =>
									setTimeInput(value[0])
								}
								onValueCommit={() => update()}
							/>
							<h2 className="ml-8 text-xl text-[#b4ade0]">
								{timeInput}&nbsp;min
							</h2>
						</div>
						<div className="flex">
							<Slider
								min={1}
								max={60}
								defaultValue={[incrementInput]}
								onValueChange={(value) =>
									setIncrementInput(value[0])
								}
								onValueCommit={() => update()}
							/>
							<h2 className="ml-8 text-xl text-[#b4ade0]">
								{incrementInput}&nbsp;s
							</h2>
						</div>
					</div>
				</GameOptCard>
				<div className="mt-12">
					<GameOptCard title="User">
						<div className="py-4 w-full flex flex-col items-center">
							<input
								type="text"
								className="w-[80%] border-[#597BF533] border-2 bg-transparent rounded-xl text-[#A49CD2] text-2xl p-4 focus:outline-none"
								placeholder="Username"
								defaultValue={userData.username ?? ""}
								onChange={(e) =>
									setUsernameInput(e.currentTarget.value)
								}
								onBlur={() => update()}
								onKeyDown={(e) => e.key === "Enter" && update()}
							/>
							<h2 className="text-gray-400 text-2xl mt-4">
								Play as&nbsp;
								<select
									defaultValue={
										userData.color === "b"
											? "black"
											: "white"
									}
									className="bg-transparent text-white font-extrabold px-1"
									onInput={(e) => {
										colorRef.current =
											e.currentTarget.value === "white"
												? "w"
												: "b";
										update();
									}}
								>
									<option value="white">white</option>
									<option value="black">black</option>
								</select>
							</h2>
						</div>
					</GameOptCard>
				</div>
				<div className="mt-16">
					<div className="mb-8">
						<GameLink
							link={link}
							timeInput={timeInput}
							incrementInput={incrementInput}
						/>
					</div>
					<h1 className="text-center text-gray-300 text-2xl">
						Waiting for opponent
					</h1>
				</div>
			</div>
		</div>
	);
};
export default CreateGameCard;
