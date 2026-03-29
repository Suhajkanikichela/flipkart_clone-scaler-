# Backend API

Express + Prisma + PostgreSQL service for the Flipkart-style demo. Full project setup and tech stack are documented in the **[root README](../README.md)**.

## Quick start

1. Install dependencies: `npm install` (from this `backend` folder).
2. Configure **`./.env`** (same folder):
   - `DATABASE_URL` — PostgreSQL connection string  
   - `JWT_SECRET` — secret for JWT tokens  
   - Optional: `PORT` (default `3000`), `HOST` (default `0.0.0.0`)
3. Generate client and apply migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
4. Seed data:
   ```bash
   npm run db:seed
   ```
5. Run the server:
   ```bash
   npm start
   ```

The API listens on **`HOST:PORT`** (defaults to all interfaces on port **3000**).

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Dev server with reload (`tsx watch src/index.ts`) |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:push` | `prisma db push` (prototyping) |
| `npm run db:seed` | Run seed (products + guest user) |
| `npm run db:update-images` | Update `Product.url` from `prisma/productImageUrls.ts` |
| `npm run db:studio` | Prisma Studio |

## Prisma config

Env loading and datasource URL are wired via `prisma.config.ts` / `prisma/loadPrismaConfig.ts` so `DATABASE_URL` is read from `backend/.env` when running CLI commands from this directory.

---

For frontend env, concurrent dev, and assumptions, see **[../README.md](../README.md)**.
