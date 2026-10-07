import pg from "pg"

const { Pool } = pg

function createPool(): pg.Pool | null {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) return null
  return new Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  })
}

export const pool = createPool()

export async function checkDb(): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!pool) {
    return { ok: false, message: "DATABASE_URL is not set" }
  }
  const client = await pool.connect()
  try {
    await client.query("SELECT 1 AS ok")
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown database error"
    return { ok: false, message }
  } finally {
    client.release()
  }
}
