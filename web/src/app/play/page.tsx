import { cookies } from "next/headers";
import JoinGame from "@/components/game/joinGame";
import { createOrGetSessionAndLink } from "@/redis/repository";
import { DEFAULT_USER_DATA } from "@/model/player";

export default async function Play() {
	const sessionValue = cookies().get("session")?.value;
	const userData = cookies().get("userData")?.value;
	const { sessionId } = await createOrGetSessionAndLink(sessionValue);

	return (
		<main
			className="w-[100vw] h-[100vh] flex bg-transparent"
			style={{
				background: "linear-gradient(180deg, #0C0D26 0%, #11121b 100%)",
			}}
		>
			<div className={"w-[97.5%] h-[95%] m-auto"}>
				<JoinGame
					userData={
						userData ? JSON.parse(userData) : DEFAULT_USER_DATA
					}
					session={sessionId}
				/>
			</div>
		</main>
	);
}
