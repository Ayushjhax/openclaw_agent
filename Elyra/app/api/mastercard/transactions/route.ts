import { NextResponse } from "next/server";
import { getUserTransactions } from "@/services/agents/financial-tools";
import { enforceRateLimit, getAppUserId, jsonError } from "../_utils";

function parseDate(value: string | null) {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function GET(request: Request) {
  try {
    const appUserId = getAppUserId(request);
    const limited = enforceRateLimit(request, "mastercard.transactions", appUserId);
    if (limited) {
      return limited;
    }

    const url = new URL(request.url);
    const transactions = await getUserTransactions(appUserId, {
      fromDate: parseDate(url.searchParams.get("from")),
      toDate: parseDate(url.searchParams.get("to")),
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    return jsonError(error, 400);
  }
}

