import type { Metadata } from "next";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { loginAction, logoutAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Abhinav Mishra",
  description: "Private blog admin login.",
  robots: {
    index: false,
    follow: false,
  },
};

function getErrorMessage(error?: string) {
  if (error === "config") {
    return "Admin login is not configured on this deployment.";
  }

  if (error === "credentials") {
    return "Email or password is incorrect.";
  }

  return null;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const isAuthenticated = await isAdminAuthenticated();
  const next = params?.next?.startsWith("/") ? params.next : "/studio";
  const error = getErrorMessage(params?.error);

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <div className="admin-copy">
          <p className="eyebrow">Admin</p>
          <h1>Blog control room</h1>
          <p>Private access for updating posts and drafts.</p>
        </div>

        {isAuthenticated ? (
          <div className="admin-form">
            <Link href="/studio" className="admin-submit">
              Open blog studio
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="admin-secondary">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <form action={loginAction} className="admin-form">
            <input type="hidden" name="next" value={next} />
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="username" required />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            {error ? <p className="admin-error">{error}</p> : null}
            <button type="submit" className="admin-submit">
              Sign in
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

