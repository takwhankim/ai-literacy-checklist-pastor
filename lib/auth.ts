import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "change-this-secret";
}

function signValue(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createAdminSessionValue() {
  const base = `${process.env.ADMIN_EMAIL || "admin"}:1`;
  return `${base}.${signValue(base)}`;
}

export function verifyAdminSessionValue(value?: string) {
  if (!value) return false;
  const idx = value.lastIndexOf(".");
  if (idx <= 0 || idx >= value.length - 1) return false;
  const base = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  if (!base || !sig) return false;
  const expected = signValue(base);
  if (expected.length !== sig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}

export function isAdminAuthenticated() {
  const cookieStore = cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminSessionValue(value);
}

export function requireAdmin() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }
}

export const ADMIN_COOKIE = COOKIE_NAME;
