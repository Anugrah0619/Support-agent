import type { Context, Next } from "hono";

export async function errorMiddleware(c: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    console.error("Unhandled error:", err);

    return c.json(
      {
        error: "Internal Server Error",
        message: err?.message || "Something went wrong",
      },
      500
    );
  }
}
