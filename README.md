# Dark Trap Store (V2) — Base e‑commerce (Next.js + Prisma)

Questa repository è una **base pronta** (scaffold “production‑oriented”) per un e‑commerce **felpe + magliette** in stile **TRAP SCURO / underground** con:

- UI/UX dark minimal ad impatto (nero / antracite / rosso scuro)
- Catalogo prodotti con varianti (taglie, colori)
- Carrello (persistente in localStorage)
- Checkout completo
- Pagamenti: **Carta (Stripe Checkout)** + **PayPal (redirect + capture)**
- Calcolo IVA (base) + spedizioni configurabili
- Stock per variante con decremento su pagamento confermato
- Area utente (NextAuth Credentials) + storico ordini
- Email transazionali (ordine ricevuto + pagamento confermato) via SMTP (o log in dev)
- SEO base: metadata, sitemap, robots
- Cookie banner con consenso (accetta / rifiuta / preferenze)
- Pagine legali (bozze) + dati aziendali nel footer
- Responsive mobile‑first

> Nota: i testi legali sono **bozze**. Prima della messa online serve revisione legale/commercialista (IVA/OSS, resi, condizioni, GDPR, licenze immagini).

---

## 1) Stack tecnico

**Frontend / App**
- Next.js (App Router) + TypeScript
- Tailwind CSS (palette dark + accento rosso)
- Componenti minimal custom

**Auth**
- NextAuth (Credentials) + Prisma Adapter  
- Registrazione via `POST /api/auth/register`

**Database**
- Prisma ORM
- Default dev: SQLite (`DATABASE_URL="file:./dev.db"`)
- Produzione consigliata: PostgreSQL (vedi sezione “Prod”)

**Pagamenti**
- Stripe Checkout (carte)
- PayPal REST (create order + capture) con redirect

**Email**
- Nodemailer via SMTP (Postmark / SendGrid / SES ecc.)
- In assenza di SMTP configurato: log su console (dev)

---

## 2) Struttura del sito (sitemap)

- `/` Home
- `/shop` Catalogo + filtri base
- `/shop/hoodies` / `/shop/tshirts` Categorie
- `/product/[slug]` Pagina prodotto (varianti + add to cart)
- `/cart` Carrello
- `/checkout` Checkout (spedizione + pagamento)
- `/checkout/success` Success Stripe
- `/checkout/cancel` Cancel
- `/checkout/paypal/return` Return PayPal (capture)
- `/auth/signin` / `/auth/register` Accesso/registrazione
- `/account` Area utente (storico ordini)
- `/account/orders/[id]` Dettaglio ordine
- `/support` FAQ/contatti
- `/about` Brand
- `/legal/*` Termini, Privacy, Cookie, Resi, Spedizioni

---

## 3) Installazione e avvio (dev)

### Prerequisiti
- Node.js 18+ (consigliato 20+)
- NPM / PNPM (a scelta)

### Setup
1) **Installa dipendenze**
```bash
npm install
```

2) **Configura variabili**
Copia `.env.example` in `.env` e compila:
```bash
cp .env.example .env
```

3) **Migrazioni DB + seed**
```bash
npm run prisma:migrate
npm run prisma:seed
```

4) **Avvia**
```bash
npm run dev
```

Apri: `http://localhost:3000`

### Utente demo (creato dal seed)
- Email: `demo@trapstore.it`
- Password: `Demo123!`

---

## 4) Pagamenti

### 4.1 Stripe (Carte)
**Flusso**
- Checkout pagina → `POST /api/checkout/stripe`
- Creazione ordine `PENDING` + Stripe Checkout Session
- Redirect a Stripe
- Webhook Stripe → `POST /api/webhooks/stripe`:
  - marca ordine `PAID`
  - decrementa stock per variante
  - invia email “Pagamento confermato”

**Variabili necessarie**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- (opz.) `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Webhook**
Configura l’endpoint (in prod) su:
- `https://TUO-DOMINIO.it/api/webhooks/stripe`

Eventi minimi:
- `checkout.session.completed`

Suggerimento dev:
- usa Stripe CLI per inoltrare webhooks in locale.

---

### 4.2 PayPal
**Flusso**
- Checkout pagina → `POST /api/checkout/paypal/create-order`
- Redirect al link `approveUrl`
- PayPal ritorna a `/checkout/paypal/return?token=PAYPAL_ORDER_ID&orderId=LOCAL_ORDER_ID`
- La return page chiama `POST /api/checkout/paypal/capture-order`
  - marca ordine `PAID`
  - decrementa stock
  - invia email “Pagamento confermato”

**Variabili necessarie**
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_ENV` = `sandbox` | `live`

---

## 5) IVA e Spedizioni

### IVA
- Implementazione base in: `src/lib/tax.ts`
- Logica: prezzi salvati e mostrati come **IVA inclusa** (gross).  
  L’IVA viene estratta come quota sul subtotale.

> Per vendite UE reali: configura aliquote paese, soglie e valuta **OSS** con il commercialista.

### Spedizioni
- Config in: `src/lib/shipping.ts`
- Zone base: IT / UE / Extra‑UE  
- Puoi modificare costi, ETA e Paesi.

---

## 6) Stock management
- Stock per variante: `Variant.stockQty`
- Validazione a checkout (server): se stock insufficiente → errore
- Decremento stock: al pagamento confermato (Stripe webhook / PayPal capture)

> In produzione: aggiungere gestione “reservations” per evitare overselling in alta domanda (optional).

---

## 7) Email automatiche
- Modulo: `src/lib/email.ts`
- Template base:
  - “Ordine ricevuto”
  - “Pagamento confermato”

Configurazione SMTP via `.env`:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `EMAIL_FROM`, `EMAIL_SUPPORT`

Se SMTP non configurato: output su console (dev).

---

## 8) Cookie banner + GDPR
- Component: `src/components/CookieBanner.tsx`
- Cookie: `cookie_consent_v1`
- Modalità:
  - Accetta tutti
  - Rifiuta tutti
  - Preferenze (analytics/marketing)

**Importantissimo:** non caricare script analytics/marketing **prima** del consenso.  
In questa base non sono inclusi script di tracking; se li aggiungi, inseriscili “after consent”.

---

## 9) Pagine legali (bozze)
Percorso: `src/app/legal/*`

- Termini: `/legal/terms`
- Privacy: `/legal/privacy`
- Cookie: `/legal/cookies`
- Resi/Recesso: `/legal/returns`
- Spedizioni: `/legal/shipping`

Dati aziendali nel footer via `.env`:
- `BUSINESS_NAME`, `BUSINESS_VAT`, `BUSINESS_ADDRESS`, `BUSINESS_REA`, `BUSINESS_EMAIL`, `BUSINESS_PEC`

---

## 10) SEO base
- Metadata base: `src/app/layout.tsx`
- Sitemap dinamica: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`
- URL pulite: `/product/[slug]`

---

## 11) File/folder principali

- `src/app/*` pagine e route API
- `src/components/*` header/footer/UI/cart/cookie banner
- `src/lib/*` logica (tax, shipping, email, prisma, paypal, stripe)
- `prisma/schema.prisma` modelli DB
- `prisma/seed.ts` seed demo
- `public/mock/*` immagini di esempio

---

## 12) Procedura “go‑live” (quella che ti ho descritto)

### Step A — Contenuti e catalogo
1) Inserisci prodotti reali (nome, descrizione, immagini) e crea varianti (taglia/colore)
2) Imposta stock realistico per ogni variante
3) Definisci guida taglie e cura capo (PDP)

### Step B — Prezzi, IVA e fiscalità
4) Conferma con il commercialista:
   - IVA corretta su abbigliamento
   - gestione fatture/corrispettivi
   - vendite UE e regime OSS (se applicabile)
5) Aggiorna `src/lib/tax.ts` con regole reali (paesi UE/extra UE)

### Step C — Spedizioni
6) Definisci zone, corrieri, costi e ETA reali in `src/lib/shipping.ts`
7) Testa il checkout con paesi diversi

### Step D — Pagamenti
8) Stripe:
   - imposta `STRIPE_SECRET_KEY`
   - configura `STRIPE_WEBHOOK_SECRET`
   - crea webhook endpoint `/api/webhooks/stripe`
9) PayPal:
   - crea app (sandbox/live)
   - imposta `PAYPAL_CLIENT_ID/SECRET`

### Step E — Email
10) Configura provider SMTP (Postmark/SendGrid/SES)
11) Testa: ordine ricevuto + pagamento confermato

### Step F — Legale / GDPR / Cookie
12) Completa pagine legali con dati reali
13) Implementa cookie banner conforme (qui base ok) e collega “Cookie settings” nel footer (roadmap)
14) Verifica basi giuridiche (marketing/newsletter)

### Step G — QA tecnico
15) Test mobile (iOS/Android), performance immagini, errori checkout
16) Logging e monitoring (consigliato: Sentry)
17) Backup DB, HTTPS, CSP

### Step H — Deploy
18) Frontend: Vercel / Netlify
19) DB: Postgres managed (Supabase/Neon/Railway ecc.)
20) Segreti in environment variables
21) Dominio + DNS + HTTPS
22) Test finale end‑to‑end (ordine + pagamento + email + stock)

---

## 12.1) Deploy su Render (step‑by‑step)

Questa base gira bene su Render come **Web Service (Node)** + **Render Postgres**.

Render supporta un **Pre‑Deploy Command** utile per migrazioni Prisma (consigliato).  
Riferimenti: Render Pre‑Deploy Command e guide Prisma/Render. 

### Step 0 — Metti il codice su GitHub
1) Crea un repository su GitHub
2) Carica questa repo (commit + push su `main`)

### Step 1 — Passa a PostgreSQL (obbligatorio per produzione)
Per Render è consigliato Postgres (evita SQLite in produzione).

1) Modifica `prisma/schema.prisma`:
   - `provider = "sqlite"` → `provider = "postgresql"`
2) In locale avvia un Postgres (consigliato via Docker) e imposta `DATABASE_URL` nel tuo `.env`.
   Esempio:
   - `postgresql://postgres:postgres@localhost:5432/trapstore?schema=public`
3) Genera migrazioni **e committale**:
```bash
npx prisma migrate dev --name init
```
4) (Opzionale) Seed:
```bash
npm run prisma:seed
```
5) Commit + push (includendo `prisma/migrations/*`).

### Step 2 — Crea il database su Render
1) Dashboard Render → **New** → **PostgreSQL**
2) Scegli regione (uguale a quella del web service) e piano
3) Una volta creato, apri la pagina DB e copia:
   - **Internal Database URL** (per usarlo dal web service su Render)
   - **External Database URL** (solo se ti serve collegarti da fuori per debug/seed)

### Step 3 — Crea il Web Service su Render
1) Dashboard Render → **New** → **Web Service**
2) Collega GitHub e seleziona la repo
3) Imposta:
   - Environment: **Node**
   - Build Command:
     ```
     npm ci && npx prisma generate && npm run build
     ```
   - Pre‑Deploy Command (consigliato):
     ```
     npx prisma migrate deploy
     ```
     (Solo al primo deploy, se vuoi popolare dati demo: aggiungi anche `&& npm run prisma:seed`, poi rimuovilo.)
   - Start Command:
     ```
     npm run start -- -p $PORT
     ```
     (assicurati che l'app ascolti su `process.env.PORT`)

### Step 4 — Imposta le Environment Variables su Render
Nella pagina del Web Service → **Environment** aggiungi:
- `DATABASE_URL` = **Internal Database URL** del tuo Render Postgres
- `NEXTAUTH_URL` = URL pubblico Render del servizio (es. `https://...onrender.com` o dominio custom)
- `NEXTAUTH_SECRET` = stringa casuale (es. `openssl rand -base64 32`)

Pagamenti:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (dopo che crei l’endpoint su Stripe)
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` (attenzione: viene “inlined” al build)

Email:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `EMAIL_FROM`, `EMAIL_SUPPORT`

Footer legale:
- `BUSINESS_*`

### Step 5 — Deploy
Premi **Deploy** e controlla i logs.

### Step 6 — Webhook Stripe (obbligatorio per chiusura ordini/stock)
1) Stripe Dashboard → Developers → Webhooks → Add endpoint
2) Endpoint:
   - `https://TUO_DOMINIO/api/webhooks/stripe`
3) Eventi minimi:
   - `checkout.session.completed`
4) Copia il “Signing secret” e incollalo in `STRIPE_WEBHOOK_SECRET` su Render

### Step 7 — PayPal (return/cancel)
Il progetto imposta `return_url` e `cancel_url` usando `NEXTAUTH_URL`.
Assicurati che `NEXTAUTH_URL` sia corretto (dominio Render o custom).

### Step 8 — Seed (se non l’hai fatto in pre‑deploy)
Opzione A (consigliata): esegui seed dal tuo PC puntando al DB esterno Render (temporaneamente).
Opzione B: aggiungi `npm run prisma:seed` nel Pre‑Deploy Command solo per il primo deploy.


---

## 13) Produzione: upgrade consigliati (roadmap)
- Passaggio a PostgreSQL:
  - in `prisma/schema.prisma` cambia `provider = "sqlite"` → `postgresql`
  - aggiorna `DATABASE_URL`
  - esegui migrazioni
- Immagini prodotto su CDN (S3/R2) + `next/image` remotePatterns
- Reservation stock (anti oversell) e pannello admin
- Fatturazione elettronica automatizzata (integrazione con provider)
- Analytics privacy‑friendly (es. Plausible) con consenso
- Policy ODR/ADR aggiornata (verifica obblighi e link ODR/ADR con un legale, perché possono cambiare nel tempo)

---

## 14) Nota su immagini / ritratti
Le immagini in `public/mock` sono **solo demo**. Prima di vendere, verifica sempre:
- diritti d’autore sulle foto
- liberatorie/diritti d’immagine
- eventuali marchi/loghi presenti

---

## Supporto
Se vuoi, posso:
- adattare tutto a un backend headless (Medusa/Vendure) mantenendo la stessa UI,
- aggiungere admin panel (gestione prodotti, stock, spedizioni, tracking, resi),
- “chiudere” i testi legali in forma più completa (sempre come bozza) con i tuoi dati reali.
