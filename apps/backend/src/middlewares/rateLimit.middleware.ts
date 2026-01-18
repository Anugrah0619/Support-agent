import type { Context, Next } from "hono";

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 30;

const requestMap = new Map<string, { count: number; start: number }>();

export async function rateLimitMiddleware(c: Context, next: Next) {
  const ip = c.req.header("x-forwarded-for") || "local";
  const now = Date.now();

  const record = requestMap.get(ip);

  if (!record) {
    requestMap.set(ip, { count: 1, start: now });
    return next();
  }

  if (now - record.start > WINDOW_MS) {
    requestMap.set(ip, { count: 1, start: now });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    return c.json(
      {
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
      },
      429
    );
  }

  record.count++;
  return next();
}
