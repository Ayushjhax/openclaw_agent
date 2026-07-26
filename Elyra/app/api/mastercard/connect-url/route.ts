import { NextResponse } from "next/server";
import { generateConnectUrl } from "@/services/mastercard";
import { recordMastercardAuditEvent } from "@/services/mastercard/audit";
import { enforceRateLimit, getAppUserId, jsonError } from "../_utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      appUserId?: string;
      userId?: string;
      firstName?: string;
      lastName?: string;
      redirectUri?: string;
    };
    const appUserId = getAppUserId(request, body);
    const limited = enforceRateLimit(request, "mastercard.connect-url", appUserId);
    if (limited) {
      return limited;
    }

    const connect = await generateConnectUrl({
      appUserId,
      firstName: body.firstName,
      lastName: body.lastName,
      redirectUri: body.redirectUri,
    });

    return NextResponse.json({
      connectUrl: connect.connectUrl,
      expiresAt: connect.expiresAt,
    });
  } catch (error) {
    await recordMastercardAuditEvent({
      action: "mastercard.connect_url.generate",
      status: "failure",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
    return jsonError(error, 400);
  }
}

