import { NextResponse } from "next/server";
import { runFinancialDataAgent } from "@/services/agents/financial-data-agent";
import { getAppUserId, enforceRateLimit, jsonError } from "../_utils";

export async function GET(request: Request) {
  try {
    const appUserId = getAppUserId(request);
    const limited = enforceRateLimit(request, "mastercard.accounts", appUserId);
    if (limited) {
      return limited;
    }

    const result = await runFinancialDataAgent(appUserId);
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error, 400);
  }
}

