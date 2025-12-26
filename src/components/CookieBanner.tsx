"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Consent = "all" | "necessary" | "custom";

const COOKIE_NAME = "cookie_consent_v1";
const MAX_AGE_DAYS = 180;

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getCookie(COOKIE_NAME);
    if (!existing) setOpen(true);
  }, []);

  function save(consent: Consent) {
    if (consent === "all") {
      setCookie(COOKIE_NAME, JSON.stringify({ consent: "all", analytics: true, marketing: true }));
      // Here you would (optionally) load analytics/marketing scripts AFTER consent.
      setOpen(false);
      return;
    }
    if (consent === "necessary") {
      setCookie(COOKIE_NAME, JSON.stringify({ consent: "necessary", analytics: false, marketing: false }));
      setOpen(false);
      return;
    }
    setCookie(
      COOKIE_NAME,
      JSON.stringify({ consent: "custom", analytics: !!analytics, marketing: !!marketing })
    );
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border/60 bg-black/80 p-4 backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="font-[var(--font-display)] text-lg">Cookie & tracking</div>
            <p className="mt-1 text-sm text-muted">
              Usiamo cookie tecnici necessari per carrello e sicurezza. Con il tuo consenso possiamo usare cookie
              statistici e marketing. Puoi modificare le preferenze in qualsiasi momento dalla pagina Cookie.
              <span className="ml-2">
                <Link className="text-fg underline decoration-accent/60 hover:decoration-accent" href="/legal/cookies">
                  Leggi la Cookie Policy
                </Link>
              </span>
            </p>

            {expanded ? (
              <div className="mt-4 grid gap-3 rounded-xl border border-border/60 bg-bg/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">Statistiche (Analytics)</div>
                    <div className="text-xs text-muted">
                      Aiuta a capire come viene usato il sito. (Caricato solo dopo consenso.)
                    </div>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[rgb(var(--accent))]"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                    />
                    attivo
                  </label>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">Marketing</div>
                    <div className="text-xs text-muted">
                      Personalizzazione annunci e remarketing. (Caricato solo dopo consenso.)
                    </div>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[rgb(var(--accent))]"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                    />
                    attivo
                  </label>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:min-w-[260px]">
            <button className="btn-primary" onClick={() => save("all")}>
              Accetta tutti
            </button>
            <button className="btn-ghost" onClick={() => save("necessary")}>
              Rifiuta tutti
            </button>
            <button
              className={cn("btn-ghost", expanded && "border-accent/60")}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Chiudi preferenze" : "Gestisci preferenze"}
            </button>
            {expanded ? (
              <button className="btn-primary" onClick={() => save("custom")}>
                Salva preferenze
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
