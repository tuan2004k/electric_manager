import { createClient } from 'redis';
import { env } from '@/config/env';

const globalForRedis = globalThis as unknown as { redis: ReturnType<typeof createClient> | undefined };

export const redisClient = globalForRedis.redis ?? createClient({
  url: env.REDIS_URL,
});

if (env.NODE_ENV !== 'production') {
  globalForRedis.redis = redisClient;
}

redisClient.connect(); 