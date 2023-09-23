import { randomUniqueUrl } from "@/utils/random";
import { randomUUID } from "crypto";
import redis from "./client";

async function createSessionAndLink(): Promise<{
	sessionId: string;
	link: string;
}> {
	const sessionId = randomUUID();
	const link = await randomUniqueUrl();
	await redis.set(sessionId, link, "EX", 86_400);
	await redis.set(link, sessionId, "EX", 86_400);
	return { sessionId, link };
}

async function getSessionAndLink(
	sessionValue?: string,
): Promise<{ sessionId: string; link: string } | null> {
	if (!sessionValue) return null;
	const link = await redis.get(sessionValue);
	if (!link) return null;
	const sessionId = await redis.get(link);
	if (!sessionId) return null;
	return { sessionId, link };
}

export async function createOrGetSessionAndLink(
	sessionValue?: string,
): Promise<{ sessionId: string; link: string }> {
	const sessionAndLink = await getSessionAndLink(sessionValue);
	return sessionAndLink ?? createSessionAndLink();
}
