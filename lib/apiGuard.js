import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export function isAllowedOrigin(origin) {
  if (!origin) return false;
  let parsed;
  try { parsed = new URL(origin); } catch { return false; }

  if (
    process.env.NODE_ENV !== "production" &&
    parsed.protocol === "http:" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname)
  ) return true;

  try {
    return Boolean(process.env.SITE_ORIGIN) && new URL(process.env.SITE_ORIGIN).origin === parsed.origin;
  } catch { return false; }
}

export function getClientIp(request) {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

function getRedis() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) return Redis.fromEnv();
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
  }
  return null;
}

export function createLimiters(prefix, { perMinute, perDay, global }) {
  const redis = getRedis();
  if (!redis) return null;
  return {
    perMinute: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(perMinute, "1 m"), prefix: `rl:${prefix}:min` }),
    perDay: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(perDay, "1 d"), prefix: `rl:${prefix}:day` }),
    globalDay: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(global, "1 d"), prefix: `rl:${prefix}:global` })
  };
}

// Returns true or false; throws on network failure.
export async function verifyTurnstile(token, ip) {
  if (!process.env.TURNSTILE_SECRET) return true;
  const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET,
      response: String(token || ""),
      remoteip: ip
    }),
    signal: AbortSignal.timeout(8000)
  }).then((response) => response.json());
  return Boolean(result.success);
}
