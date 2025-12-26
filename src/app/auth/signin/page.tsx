"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/account",
    });

    if (res?.error) {
      setError("Credenziali non valide.");
      setLoading(false);
      return;
    }

    window.location.href = res?.url ?? "/account";
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card p-6">
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Accesso</div>
        <h1 className="mt-1 font-[var(--font-display)] text-3xl text-white">SIGN IN</h1>
        <p className="mt-2 text-sm text-muted">Accedi per vedere lo storico ordini.</p>

        {error ? <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">{error}</div> : null}

        <form className="mt-4 grid gap-4" onSubmit={onSubmit}>
          <div>
            <div className="label">Email</div>
            <input className="input mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <div className="label">Password</div>
            <input className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Accesso..." : "Entra"}
          </button>
        </form>

        <div className="mt-4 text-xs text-muted">
          Non hai un account?{" "}
          <Link className="underline decoration-accent/60 hover:decoration-accent" href="/auth/register">
            Registrati
          </Link>
        </div>

        <div className="mt-6 border-t border-border/50 pt-4 text-xs text-muted">
          Demo (seed): <span className="text-fg">demo@trapstore.it</span> · Password: <span className="text-fg">Demo123!</span>
        </div>
      </div>
    </div>
  );
}
