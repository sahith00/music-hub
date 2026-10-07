import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { drizzle } from "drizzle-orm/node-postgres"
import { pool } from "../db.js"
import * as schema from "./schema.js"

let cached: NodePgDatabase<typeof schema> | null = null

export function getDb(): NodePgDatabase<typeof schema> | null {
  if (!pool) return null
  if (!cached) {
    cached = drizzle(pool, { schema })
  }
  return cached
}
