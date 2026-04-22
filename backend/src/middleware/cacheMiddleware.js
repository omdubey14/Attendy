import { getCache, setCache } from "../utils/cache.js";

export const cacheResponse =
  (keyBuilder, ttl) =>
  (req, res, next) => {
    const key = keyBuilder(req);
    const cached = getCache(key);

    if (cached) return res.status(200).json(cached);

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      setCache(key, body, ttl);
      return originalJson(body);
    };

    return next();
  };
