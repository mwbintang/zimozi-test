import { redis } from "../config/redis";
import { REDIS_TTL } from "../constants/time";

export const setRedisCache = async (key: string, value: any) => {
    await redis.setex(key, REDIS_TTL, JSON.stringify(value));
}

export const getRedisCache = async (key: string) => {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
}

export const deleteRedisCache = async (key: string) => {
    await redis.del(key);
}

export const invalidateCache = async (pattern: string) => {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await Promise.all(keys.map((key) => redis.del(key)));
    }
}

