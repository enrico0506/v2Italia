"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Errore registrazione.");

      // Auto sign-in
      const s = await signIn("credentials", { redirect: false, email, password, callbackUrl: "/account" });
      if (s?.error) throw new Error("Registrazione ok, ma login fallito. Prova a fare Sign In.");
      window.location.href = s?.url ?? "/account";
    } catch (e: any) {
      setError(e.message ?? "Errore.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card p-6">
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Registrazione</div>
        <h1 className="mt-1 font-[var(--font-display)] text-3xl text-white">CREATE ACCOUNT</h1>
        <p className="mt-2 text-sm text-muted">Crea l’account per salvare ordini e indirizzi.</p>

        {error ? <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">{error}</div> : null}

        <form className="mt-4 grid gap-4" onSubmit={onSubmit}>
          <div>
            <div className="label">Nome (opz.)</div>
            <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <div className="label">Email</div>
            <input className="input mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <div className="label">Password</div>
            <input className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="mt-1 text-xs text-muted">Min 8 caratteri.</div>
          </div>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Creo account..." : "Registrati"}
          </button>
        </form>

        <div className="mt-4 text-xs text-muted">
          Hai già un account?{" "}
          <Link className="underline decoration-accent/60 hover:decoration-accent" href="/auth/signin">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
