import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = new URL("/", url.origin);
  target.searchParams.set("connectedAccounts", "1");
  target.searchParams.set("mastercardReturn", "1");

  return NextResponse.redirect(target);
}

