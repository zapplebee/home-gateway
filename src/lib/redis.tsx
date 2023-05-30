import RedisStore from "connect-redis";
import { createClient } from "redis";
import { REDIS_URL, REDIS_SESSION_PREFIX } from "./../constants";

export function initializeRedis(): {
  redisClient: ReturnType<typeof createClient>;
  redisStore: RedisStore;
} {
  let redisClient = createClient({
    url: REDIS_URL,
  });

  let redisStore = new RedisStore({
    client: redisClient,
    prefix: REDIS_SESSION_PREFIX,
  });

  return { redisClient, redisStore };
}
