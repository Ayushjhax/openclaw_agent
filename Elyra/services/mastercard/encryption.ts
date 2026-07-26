import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;

let warnedAboutDevKey = false;

function decodeConfiguredKey(value: string): Buffer {
  const trimmed = value.trim();
  const maybeBase64 = Buffer.from(trimmed, "base64");
  if (maybeBase64.length === 32) {
    return maybeBase64;
  }

  const maybeHex = Buffer.from(trimmed, "hex");
  if (maybeHex.length === 32) {
    return maybeHex;
  }

  return crypto.createHash("sha256").update(trimmed).digest();
}

function getKey() {
  const configured = process.env.MASTERCARD_ENCRYPTION_KEY;
  if (configured) {
    return decodeConfiguredKey(configured);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing MASTERCARD_ENCRYPTION_KEY in production.");
  }

  if (!warnedAboutDevKey) {
    console.warn(
      "[elyra] Using a development Mastercard encryption key. Set MASTERCARD_ENCRYPTION_KEY before using real data.",
    );
    warnedAboutDevKey = true;
  }

  return crypto
    .createHash("sha256")
    .update(`elyra-mastercard-dev:${process.cwd()}`)
    .digest();
}

export function encryptIdentifier(value: string) {
  const key = getKey();
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64url"),
    tag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
}

export function decryptIdentifier(payload: string) {
  const [version, ivText, tagText, encryptedText] = payload.split(":");
  if (version !== "v1" || !ivText || !tagText || !encryptedText) {
    throw new Error("Unsupported encrypted identifier format.");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivText, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function hashIdentifier(value: string) {
  return crypto.createHmac("sha256", getKey()).update(value).digest("hex");
}

