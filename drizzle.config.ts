import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL || "file:db.db";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
