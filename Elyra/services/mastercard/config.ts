export type MastercardConfig = {
  baseUrl: string;
  partnerId: string;
  appKey: string;
  partnerSecret: string;
  customerType: "testing" | "active";
  redirectUri?: string;
  webhookUrl?: string;
  connectExperience: string;
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env.local on the server.`);
  }
  return value;
}

export function getMastercardConfig(): MastercardConfig {
  const customerType =
    process.env.MASTERCARD_CUSTOMER_TYPE === "active" ? "active" : "testing";

  return {
    baseUrl:
      process.env.MASTERCARD_API_BASE_URL?.replace(/\/$/, "") ??
      "https://api.finicity.com",
    partnerId: requiredEnv("MASTERCARD_PARTNER_ID"),
    appKey:
      process.env.MASTERCARD_APP_KEY?.trim() ??
      requiredEnv("MASTERCARD_APP_NAME"),
    partnerSecret: requiredEnv("MASTERCARD_PARTNER_SECRET"),
    customerType,
    redirectUri: process.env.MASTERCARD_CONNECT_REDIRECT_URI?.trim(),
    webhookUrl: process.env.MASTERCARD_WEBHOOK_URL?.trim(),
    connectExperience: process.env.MASTERCARD_CONNECT_EXPERIENCE ?? "default",
  };
}

