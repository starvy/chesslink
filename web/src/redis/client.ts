import { Redis } from "ioredis";

const globalForRedis = globalThis as unknown as {
	prisma: Redis | undefined;
};

const redis = globalForRedis.prisma ?? new Redis(process.env.REDIS_URL ?? "");
export default redis;

if (process.env.NODE_ENV !== "production") globalForRedis.prisma = redis;
