import { cookies } from "next/headers";
import MainMenu from "@/components/menu/mainMenu";
import { createOrGetSessionAndLink } from "@/redis/repository";

export default async function Home() {
	const cookieStore = cookies();
	const sessionValue = cookieStore.get("session")?.value;
	const { sessionId, link } = await createOrGetSessionAndLink(sessionValue);

	return <MainMenu session={sessionId} link={link} />;
}
