# Flipkart-style e-commerce demo

A full-stack demo with a React (Vite) storefront and an Express + Prisma API backed by PostgreSQL. UI is inspired by Flipkart; checkout and payments are demo-only.

---

### Deployment Link

http://ec2-15-207-113-132.ap-south-1.compute.amazonaws.com/

---

## Tech stack

| Layer | Technologies |
|--------|----------------|
| **Frontend** | React 19, React Router 7, Vite 8, TypeScript, Tailwind CSS 4 |
| **Backend** | Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL (`pg`) |
| **Auth** | JWT (`jsonwebtoken`), bcrypt password hashing |
| **Tooling** | ESLint, `concurrently` (run web + API together) |

---

## Prerequisites

- **Node.js** 20+ recommended (matches current LTS range used with Vite 8 / Prisma 7).
- **PostgreSQL** reachable URL (local Docker, [Neon](https://neon.tech), etc.).
- **npm** (or pnpm/yarn with equivalent commands).

---

## Repository layout

```
.
├── src/                 # React app (Vite)
├── backend/
│   ├── prisma/          # schema, migrations, seed, image URL map
│   └── src/             # Express entry + routes
├── package.json         # frontend scripts + dev:all
└── backend/package.json # API scripts
```

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url> flipkart-final-clone
cd flipkart-final-clone
npm install
cd backend && npm install && cd ..
```

### 2. Backend environment (`backend/.env`)

Create `backend/.env` (see **Environment variables** below). Minimum:

- `DATABASE_URL` — PostgreSQL connection string.
- `JWT_SECRET` — long random string for signing auth tokens.

### 3. Database and seed

From the **`backend`** directory:

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

`db:seed` creates categories/products and a guest user used for anonymous checkout flows.

### 4. Frontend environment (optional)

At the **repo root**, optional `.env`:

- `VITE_API_URL` — API base URL **without** a trailing slash.  
  Default if unset: `http://localhost:3000`.

Use your LAN IP when testing from another device, e.g. `VITE_API_URL=http://192.168.1.10:3000`.

### 5. Run the app

**Option A — both servers (from repo root):**

```bash
npm run dev:all
```

**Option B — two terminals**

- Terminal 1 (repo root): `npm run dev` → Vite dev server (default port **5173**).
- Terminal 2 (`backend`): `npm start` → API (default port **3000**, binds to `0.0.0.0`).

Open **http://localhost:5173** (or your machine’s LAN IP on port 5173).

**Production build (frontend only):**

```bash
npm run build
npm run preview
```

---

## Environment variables

### Root (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | API origin, e.g. `http://localhost:3000`. Omit to use that default. |

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL URL for Prisma. |
| `JWT_SECRET` | Yes | Secret for JWT signing (login/signup). |
| `PORT` | No | API port; default **3000**. |
| `HOST` | No | Bind address; default **`0.0.0.0`** (all interfaces). Set `127.0.0.1` to restrict to localhost. |

---

## Useful scripts

| Where | Command | Purpose |
|-------|---------|---------|
| Root | `npm run dev` | Vite dev server |
| Root | `npm run dev:all` | Vite + backend together |
| Root | `npm run build` | Typecheck + production bundle |
| `backend` | `npm start` | API with watch (`tsx watch`) |
| `backend` | `npm run db:seed` | Reseed catalog + guest user |
| `backend` | `npm run db:update-images` | Update product image URLs from map |
| `backend` | `npm run db:studio` | Prisma Studio |

---

## API overview (high level)

- `GET/POST` `/auth/*` — signup, login, `me` (Bearer JWT).
- `GET` `/products`, `/products/:id`, categories, search, etc.
- `POST` `/cart/preview` — cart pricing/stock preview.
- `POST` `/orders` — place order (guest user in seed).

CORS is configured to allow any origin in development-style setups (`origin: true`).

---

## Assumptions

1. **PostgreSQL** is used as the only database; SQLite is not supported by the current Prisma setup without changes.
2. **Checkout** is demo: no real payment gateway; orders attach to a seeded **guest** user when not using JWT for order ownership (behavior is as implemented in the codebase).
3. **JWT** is stored in the browser **localStorage** (`fk_jwt_token`); suitable for demos—not a recommendation for high-security production without hardening (httpOnly cookies, CSRF strategy, etc.).
4. Default **API URL** is `http://localhost:3000`; any other host/port must be set via `VITE_API_URL` before building or running the dev server.
5. **Node** and **npm** versions are assumed compatible with the listed dependencies; lockfiles may pin exact versions.
6. The app is tested primarily on **modern Chromium/Firefox/Safari**; IE is not supported.

---

## More detail for the API

See **[backend/README.md](./backend/README.md)** for backend-focused commands and notes.
