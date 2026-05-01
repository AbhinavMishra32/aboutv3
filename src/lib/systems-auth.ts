import { createHash } from "node:crypto";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const SYSTEMS_ADMIN_COOKIE = "systems_admin_session";

function getAdminPassword() {
  return process.env.SYSTEMS_ADMIN_PASSWORD;
}

function getAdminToken() {
  const password = getAdminPassword();
  if (!password) return null;
  return createHash("sha256").update(password).digest("hex");
}

export function isSystemsAdminConfigured() {
  return Boolean(getAdminPassword());
}

export function verifySystemsPassword(input: string) {
  const password = getAdminPassword();
  if (!password) return false;
  return input === password;
}

export function getSystemsAdminSessionToken() {
  return getAdminToken();
}

export function hasSystemsAdminSession(cookieStore: Pick<ReadonlyRequestCookies, "get">) {
  const token = getAdminToken();
  if (!token) return false;
  return cookieStore.get(SYSTEMS_ADMIN_COOKIE)?.value === token;
}
