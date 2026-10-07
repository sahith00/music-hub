import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export type PublicProfile = {
  id: number
  displayName: string
  username: string
  createdAt: string
}

const inputClassName =
  "flex-1 min-w-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm"

export function HomeProfiles() {
  const [profiles, setProfiles] = useState<PublicProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [saving, setSaving] = useState(false)

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    username.trim().length > 0

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/profiles")
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? `Request failed (${res.status})`)
      }
      const data = (await res.json()) as { profiles?: PublicProfile[] }
      setProfiles(data.profiles ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profiles")
      setProfiles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const displayName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedUsername = username.trim()
    if (!displayName || !trimmedEmail || !trimmedUsername) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          email: trimmedEmail,
          username: trimmedUsername,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`)
      }
      setName("")
      setEmail("")
      setUsername("")
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-10 rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold mb-1">Public profiles</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xl">
        Data lives in Postgres through the API. Profiles store a display name,
        username, and email—no passwords or other sensitive fields.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name"
          maxLength={80}
          className={inputClassName}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          maxLength={255}
          className={inputClassName}
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          maxLength={255}
          className={inputClassName}
        />
        <Button type="submit" disabled={saving || !canSubmit}>
          {saving ? "Saving…" : "Add profile"}
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-destructive mb-4" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : profiles.length === 0 ? (
        <p className="text-sm text-muted-foreground">No profiles yet.</p>
      ) : (
        <ul className="space-y-2">
          {profiles.map((p) => (
            <li
              key={p.id}
              className="flex justify-between gap-4 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <span>
                <span className="font-medium">{p.displayName}</span>
                {p.username ? (
                  <span className="text-muted-foreground"> @{p.username}</span>
                ) : null}
              </span>
              <span className="text-muted-foreground tabular-nums shrink-0">
                {new Date(p.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
