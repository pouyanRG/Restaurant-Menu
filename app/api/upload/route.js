import { createLimiters, getClientIp, getRedis, isAllowedOrigin } from "@/lib/apiGuard";

export const runtime = "nodejs";
export const maxDuration = 15;

const MAX_BODY = 1 * 1024 * 1024;
const MAX_IMAGE = 600 * 1024;
const TTL_SECONDS = 60 * 60;
const limiters = createLimiters("upload", { perMinute: 8, perDay: 60, global: 1500 });
const json = (body, status = 200) => Response.json(body, { status });

function detectType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

export async function POST(request) {
  if (!isAllowedOrigin(request.headers.get("origin"))) return json({ error: "Forbidden" }, 403);
  if (Number(request.headers.get("content-length") || 0) > MAX_BODY) return json({ error: "Too large" }, 413);

  const redis = getRedis();
  if (!limiters || !redis) return json({ error: "Storage is not configured" }, 503);

  const ip = getClientIp(request);
  try {
    const [minute, day, global] = await Promise.all([
      limiters.perMinute.limit(ip),
      limiters.perDay.limit(ip),
      limiters.globalDay.limit("all")
    ]);
    if (!minute.success || !day.success) return json({ error: "Too many requests" }, 429);
    if (!global.success) return json({ error: "Service busy, try later" }, 503);
  } catch (error) {
    console.error("Upload rate limit error:", error);
    return json({ error: "Service unavailable" }, 503);
  }

  let form;
  try { form = await request.formData(); } catch { return json({ error: "Bad request" }, 400); }

  const file = form.get("image");
  if (!file || typeof file === "string" || file.size === 0) return json({ error: "Bad request" }, 400);
  if (file.size > MAX_IMAGE) return json({ error: "Too large" }, 413);

  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = detectType(bytes);
  if (!mime) return json({ error: "Bad image" }, 400);

  const id = crypto.randomUUID();
  try {
    await redis.set(`img:${id}`, { mime, data: bytes.toString("base64") }, { ex: TTL_SECONDS });
  } catch (error) {
    console.error("Upload store error:", error);
    return json({ error: "Storage error" }, 502);
  }
  return json({ id });
}
