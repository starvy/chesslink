import { cookies } from "next/headers";
import MainMenu from "@/components/menu/mainMenu";
import { createOrGetSessionAndLink } from "@/redis/repository";
import { DEFAULT_USER_DATA } from "@/model/player";

export default async function Home() {
	const cookieStore = cookies();
	const sessionValue = cookieStore.get("session")?.value;
	const userData = cookieStore.get("userData")?.value;
	const { sessionId, link } = await createOrGetSessionAndLink(sessionValue);

	return (
		<MainMenu
			session={sessionId}
			link={link}
			initialUserData={
				userData ? JSON.parse(userData) : DEFAULT_USER_DATA
			}
		/>
	);
}
