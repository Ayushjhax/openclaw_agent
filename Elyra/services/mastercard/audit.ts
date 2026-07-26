import { mastercardRepository } from "./repository";

export type MastercardAuditEvent = {
  appUserId?: string;
  action: string;
  status: "success" | "failure" | "info";
  detail?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function recordMastercardAuditEvent(event: MastercardAuditEvent) {
  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...event,
  };

  await mastercardRepository.addAuditLog(entry);

  const safeMetadata = event.metadata
    ? Object.fromEntries(
        Object.entries(event.metadata).filter(
          ([key]) => !/secret|token|password/i.test(key),
        ),
      )
    : undefined;

  console.info("[mastercard-open-finance]", {
    action: event.action,
    status: event.status,
    appUserId: event.appUserId,
    detail: event.detail,
    metadata: safeMetadata,
  });
}

