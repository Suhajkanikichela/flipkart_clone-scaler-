import fs from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// This file lives in `backend/prisma/` — project root for the backend package is one level up.
const backendRoot = path.resolve(__dirname, "..");

const envPath = path.join(backendRoot, ".env");
if (fs.existsSync(envPath)) {
  loadEnv({ path: envPath });
}

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error(
    `DATABASE_URL is not set. Add it to ${envPath} or export it in the shell.`,
  );
}

export default defineConfig({
  schema: path.join(backendRoot, "prisma", "schema.prisma"),
  migrations: {
    path: path.join(backendRoot, "prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
