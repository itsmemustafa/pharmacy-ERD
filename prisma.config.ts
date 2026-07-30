import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
);
config({ path: path.join(projectRoot, ".env") });

/** Placeholder only for `prisma generate` when `.env` is not set yet */
const directUrl =
  process.env.DIRECT_URL ??
  "postgresql://localhost:5432/pharmacy_db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: directUrl,
  },
});