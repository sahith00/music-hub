import { desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { getDb } from "../db/client.js"
import { users } from "../db/schema.js"

function parseDisplayName(body: unknown): string | null {
  if (!body || typeof body !== "object") return null
  const raw = (body as { displayName?: unknown }).displayName
  if (typeof raw !== "string") return null
  const trimmed = raw.trim()
  if (trimmed.length < 1 || trimmed.length > 80) return null
  return trimmed
}

function parseEmail(body: unknown): string | null {
  if (!body || typeof body !== "object") return null
  const raw = (body as { email?: unknown }).email
  if (typeof raw !== "string") return null
  const trimmed = raw.trim().toLowerCase()
  if (trimmed.length < 3 || trimmed.length > 255) return null
  if (!trimmed.includes("@")) return null
  return trimmed
}

function parseUsername(body: unknown): string | null {
  if (!body || typeof body !== "object") return null
  const raw = (body as { username?: unknown }).username
  if (typeof raw !== "string") return null
  const trimmed = raw.trim()
  if (trimmed.length < 3 || trimmed.length > 255) return null
  return trimmed
}

export const profilesRoutes = new Hono()

profilesRoutes.get("/", async (c) => {
  const db = getDb()
  if (!db) {
    return c.json({ error: "Database is not configured" }, 503)
  }

  const rows = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      username: users.username,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(50)

  return c.json({
    profiles: rows.map((row) => ({
      id: row.id,
      displayName: row.displayName,
      username: row.username,
      createdAt: row.createdAt.toISOString(),
    })),
  })
})

profilesRoutes.get("/:id", async (c) => {
  const idParam = c.req.param("id")
  const id = Number.parseInt(idParam, 10)
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: "Invalid id" }, 400)
  }

  const db = getDb()
  if (!db) {
    return c.json({ error: "Database is not configured" }, 503)
  }

  const [row] = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      username: users.username,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!row) {
    return c.json({ error: "Not found" }, 404)
  }

  return c.json({
    profile: {
      id: row.id,
      displayName: row.displayName,
      username: row.username,
      createdAt: row.createdAt.toISOString(),
    },
  })
})

profilesRoutes.post("/", async (c) => {
  const db = getDb()
  if (!db) {
    return c.json({ error: "Database is not configured" }, 503)
  }

  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400)
  }

  const displayName = parseDisplayName(body)
  const email = parseEmail(body)
  const username = parseUsername(body)
  if (!displayName || !email || !username) {
    return c.json(
      {
        error:
          "displayName, email, and username are required",
      },
      400,
    )
  }

  const [created] = await db
    .insert(users)
    .values({ displayName, email, username })
    .returning({
      id: users.id,
      displayName: users.displayName,
      username: users.username,
      createdAt: users.createdAt,
    })

  if (!created) {
    return c.json({ error: "Failed to create profile" }, 500)
  }

  return c.json(
    {
      profile: {
        id: created.id,
        displayName: created.displayName,
        username: created.username,
        createdAt: created.createdAt.toISOString(),
      },
    },
    201,
  )
})
