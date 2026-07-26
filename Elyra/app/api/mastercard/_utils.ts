import { NextResponse } from "next/server";
import { checkRateLimit } from "@/services/mastercard/rate-limit";

export function getAppUserId(request: Request, body?: { appUserId?: unknown; userId?: unknown }) {
  const headerUserId = request.headers.get("x-elyra-user-id");
  const candidate = body?.appUserId ?? body?.userId ?? headerUserId;
  if (typeof candidate !== "string" || candidate.trim().length < 3) {
    throw new Error("Authenticated user id is required.");
  }
  return candidate.trim();
}

export function enforceRateLimit(request: Request, scope: string, appUserId?: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = `${scope}:${appUserId ?? forwarded ?? "anonymous"}`;
  const result = checkRateLimit(key, {
    limit: appUserId ? 30 : 8,
    windowMs: 60_000,
  });

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: "Too many Mastercard Open Finance requests. Try again shortly.",
        resetAt: result.resetAt,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  return null;
}

export function jsonError(error: unknown, status = 500) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Unknown error" },
    { status },
  );
}

