import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "aboutv3_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type AdminSession = {
  email: string;
  exp: number;
};

function base64Url(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

function getAdminConfig() {
  const email = process.env.BLOG_ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.BLOG_ADMIN_PASSWORD_HASH?.trim();
  const sessionSecret = process.env.BLOG_ADMIN_SESSION_SECRET?.trim();

  if (!email || !passwordHash || !sessionSecret) return null;

  return { email, passwordHash, sessionSecret };
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterationsValue, salt, expectedHash] = storedHash.split("$");
  const iterations = Number(iterationsValue);

  if (algorithm !== "pbkdf2_sha256" || !Number.isInteger(iterations) || !salt || !expectedHash) {
    return false;
  }

  const actual = pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const actualBuffer = Buffer.from(actual, "hex");

  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

export function createAdminPasswordHash(password: string) {
  const iterations = 310000;
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");

  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

export async function isAdminAuthenticated() {
  const config = getAdminConfig();
  if (!config) return false;

  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!value) return false;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = signPayload(payload, config.sessionSecret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    return session.email === config.email && session.exp > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdmin(next = "/studio") {
  if (await isAdminAuthenticated()) return;
  redirect(`/admin?next=${encodeURIComponent(next)}`);
}

export async function loginAdmin(email: string, password: string) {
  const config = getAdminConfig();
  if (!config) return { ok: false, reason: "config" as const };

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== config.email || !verifyPassword(password, config.passwordHash)) {
    return { ok: false, reason: "credentials" as const };
  }

  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = base64Url(JSON.stringify({ email: config.email, exp: expiresAt } satisfies AdminSession));
  const signature = signPayload(payload, config.sessionSecret);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return { ok: true, reason: null };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

