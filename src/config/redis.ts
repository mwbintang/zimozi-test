// redisClient.js
import Redis from 'ioredis';

// Initialize Redis client
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PW || '',
});

redis.on('error', (err: any) => {
  console.error('Redis error:', err);
});


