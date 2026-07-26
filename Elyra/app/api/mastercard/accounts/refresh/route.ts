import { NextResponse } from "next/server";
import { runFinancialDataAgent } from "@/services/agents/financial-data-agent";
import { refreshAccounts } from "@/services/mastercard";
import { recordMastercardAuditEvent } from "@/services/mastercard/audit";
import { enforceRateLimit, getAppUserId, jsonError } from "../../_utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      appUserId?: string;
      userId?: string;
    };
    const appUserId = getAppUserId(request, body);
    const limited = enforceRateLimit(request, "mastercard.accounts.refresh", appUserId);
    if (limited) {
      return limited;
    }

    await refreshAccounts(appUserId);
    const result = await runFinancialDataAgent(appUserId);
    return NextResponse.json(result);
  } catch (error) {
    await recordMastercardAuditEvent({
      action: "mastercard.accounts.refresh",
      status: "failure",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
    return jsonError(error, 400);
  }
}

