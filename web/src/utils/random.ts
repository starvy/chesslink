import redis from "@/redis/client";
import { randomBytes } from "crypto";

const ALLOWED_CHARS =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const length = 4;

const randomUrl = (): string => {
	return new Array(length)
		.fill("")
		.map(() => {
			let r = randomBytes(1).toString("ascii");
			while (!ALLOWED_CHARS.includes(r)) {
				r = randomBytes(1).toString("ascii");
			}
			return r;
		})
		.join("");
};

export const randomUniqueUrl = async (): Promise<string> => {
	const url = randomUrl(); // TODO: if there is high number of taken urls, make the url longer
	return (await redis.exists(url)) ? randomUniqueUrl() : url;
};
