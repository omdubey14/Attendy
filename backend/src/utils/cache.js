import NodeCache from "node-cache";
import { env } from "../config/env.js";

const cache = new NodeCache({
  stdTTL: env.cacheTtl,
  checkperiod: Math.max(env.cacheTtl * 0.2, 30),
});

export const getCache = (key) => cache.get(key);
export const setCache = (key, value, ttl) => cache.set(key, value, ttl);
export const delCache = (keys) => {
  const keyList = Array.isArray(keys) ? keys : [keys];
  cache.del(keyList);
};
export const clearCache = () => cache.flushAll();
