/// <reference types="node" />
import { existsSync } from "node:fs"
import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: existsSync("/.dockerenv") ? ".env.docker" : ".env" })

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
})
