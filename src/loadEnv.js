import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const envPath = path.join(projectRoot, ".env");

if (!fs.existsSync(envPath)) {
  console.error(
    [
      "",
      "Missing .env file in project root.",
      "Copy the template and edit your database URL:",
      "  cp .env.example .env",
      "",
    ].join("\n"),
  );
}

const result = dotenv.config({ path: envPath });

if (result.error && result.error.code !== "ENOENT") {
  console.error("Failed to load .env:", result.error.message);
}
