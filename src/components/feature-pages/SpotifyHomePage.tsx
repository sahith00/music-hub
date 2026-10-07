import { AudioLines, ListMusic, SlidersHorizontal, Sparkles } from "lucide-react"
import {
  FeatureLayout,
  type FeaturePageProps,
} from "@/components/FeatureLayout"

const listenStats = [
  { label: "Minutes listened", value: "—" },
  { label: "Top genre", value: "—" },
  { label: "Playlists", value: "—" },
]

const workspaceCards = [
  {
    title: "Playlists categorizer",
    desc: "Group existing playlists by mood, tempo, and genre.",
    icon: ListMusic,
  },
  {
    title: "Music modifiers",
    desc: "Shape playback with energy, danceability, and key filters.",
    icon: SlidersHorizontal,
  },
  {
    title: "Playlist suggestions",
    desc: "Surface follow-up mixes from recent listens.",
    icon: Sparkles,
  },
]

export function SpotifyHomePage({ feature }: FeaturePageProps) {
  return (
    <FeatureLayout feature={feature} showHighlights={false}>
      <section className="rounded-xl border border-border bg-card p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="size-16 rounded-xl bg-green-500/15 flex items-center justify-center text-green-400 shrink-0">
            <AudioLines className="size-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Now playing</h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Nothing is playing yet. This panel is the hook for a playback
              visualizer once a Spotify session is connected.
            </p>
          </div>
        </div>
      </section>

      <h3 className="text-lg font-semibold mb-4">Listen stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {listenStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-6"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-4">Playlist tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaceCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="rounded-lg border border-border bg-card p-6"
            >
              <Icon className="size-5 mb-3 text-green-400" />
              <h4 className="font-medium mb-1">{card.title}</h4>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </div>
          )
        })}
      </div>
    </FeatureLayout>
  )
}
