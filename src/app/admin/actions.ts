"use server";

import { redirect } from "next/navigation";
import { loginAdmin, logoutAdmin } from "@/lib/admin-auth";

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "/studio";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/studio";
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const result = await loginAdmin(email, password);

  if (result.ok) {
    redirect(next);
  }

  redirect(`/admin?next=${encodeURIComponent(next)}&error=${result.reason}`);
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin");
}

