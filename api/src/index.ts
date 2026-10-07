import "dotenv/config"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { checkDb } from "./db.js"
import { profilesRoutes } from "./routes/profiles.js"

const app = new Hono()

const devOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"]

const corsOrigins =
  process.env.CORS_ORIGIN?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? devOrigins

app.use("*", cors({ origin: corsOrigins }))

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "music-hub-api",
  }),
)

app.get("/api/db/health", async (c) => {
  const result = await checkDb()
  if (!result.ok) {
    return c.json({ ok: false, db: false, error: result.message }, 503)
  }
  return c.json({ ok: true, db: true })
})

app.route("/api/profiles", profilesRoutes)

const port = Number(process.env.PORT) || 4000

serve({ fetch: app.fetch, port }, (info) => {
  console.info(`music-hub-api listening on http://localhost:${info.port}`)
})
