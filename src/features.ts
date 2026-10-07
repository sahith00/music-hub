import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AudioLines,
  BarChart3,
  Guitar,
  Mic2,
  Music,
  Radio,
  ScanSearch,
  Search,
  Split,
  Waves,
} from "lucide-react"

export type FeatureId =
  | "home"
  | "synth"
  | "effect-analyzer"
  | "vocal-range"
  | "musical-search"
  | "audio-visualizer"
  | "spotify"
  | "synth-analyzer"
  | "voice-splitter"
  | "sampler"
  | "guitar-tabs"

export type Feature = {
  id: FeatureId
  name: string
  description: string
  icon: LucideIcon
  color: string
  highlights: string[]
}

/** Sidebar + panel metadata. Feature UIs resolve in src/feature-registry.ts. Keep Home first. */
export const features: Feature[] = [
  {
    id: "home",
    name: "Home",
    description: "Dashboard overview",
    icon: Music,
    color: "from-primary/20 to-primary/5",
    highlights: [
      "Professional-grade audio tools",
      "Intuitive workflow design",
      "Real-time collaboration",
      "Cloud project storage",
    ],
  },
  {
    id: "synth",
    name: "Synth sounds generator",
    description: "Generate and shape synthesizer sounds",
    icon: Waves,
    color: "from-purple-500/20 to-purple-500/5",
    highlights: [
      "Coming soon",
      "Oscillators and filters",
      "Preset library",
      "Playable keyboard",
    ],
  },
  {
    id: "effect-analyzer",
    name: "Effect analyzer",
    description: "Inspect audio effects and processing",
    icon: Activity,
    color: "from-blue-500/20 to-blue-500/5",
    highlights: [
      "Coming soon",
      "Spectrum and dynamics",
      "Before/after comparison",
      "Effect chain insights",
    ],
  },
  {
    id: "vocal-range",
    name: "Vocal range analyzer",
    description: "Measure vocal range and pitch",
    icon: Mic2,
    color: "from-red-500/20 to-red-500/5",
    highlights: [
      "Coming soon",
      "Pitch detection",
      "Range mapping",
      "Practice feedback",
    ],
  },
  {
    id: "musical-search",
    name: "Musical Search",
    description: "Search music by key, genre, and more",
    icon: Search,
    color: "from-amber-500/20 to-amber-500/5",
    highlights: [
      "Coming soon",
      "Filter by key",
      "Filter by genre",
      "Catalog browsing",
    ],
  },
  {
    id: "audio-visualizer",
    name: "Audio Visualizer",
    description: "Real-time visualization of audio",
    icon: AudioLines,
    color: "from-cyan-500/20 to-cyan-500/5",
    highlights: [
      "Coming soon",
      "Waveform display",
      "Frequency spectrum",
      "Playback-linked visuals",
    ],
  },
  {
    id: "spotify",
    name: "Spotify Home",
    description: "Spotify playback, playlists, and listen stats",
    icon: BarChart3,
    color: "from-green-500/20 to-green-500/5",
    highlights: [
      "Music playing visualizer",
      "Playlists categorizer",
      "Music modifiers",
      "Playlists suggestions",
      "Listen stats",
    ],
  },
  {
    id: "synth-analyzer",
    name: "Synth analyzer",
    description: "Analyze synthesizer output and harmonics",
    icon: ScanSearch,
    color: "from-violet-500/20 to-violet-500/5",
    highlights: [
      "Coming soon",
      "Harmonic analysis",
      "Oscilloscope view",
      "Patch diagnostics",
    ],
  },
  {
    id: "voice-splitter",
    name: "Voice Splitter",
    description: "Separate vocal stems from mixed audio",
    icon: Split,
    color: "from-orange-500/20 to-orange-500/5",
    highlights: [
      "Coming soon",
      "Stem separation",
      "Vocal isolation",
      "Export tracks",
    ],
  },
  {
    id: "sampler",
    name: "Sampler",
    description: "Sample library and player",
    icon: Radio,
    color: "from-teal-500/20 to-teal-500/5",
    highlights: [
      "Coming soon",
      "Load samples",
      "Slice and map",
      "Playback engine",
    ],
  },
  {
    id: "guitar-tabs",
    name: "Guitar tabs",
    description: "Generate guitar tablature from audio",
    icon: Guitar,
    color: "from-rose-500/20 to-rose-500/5",
    highlights: [
      "Coming soon",
      "Tab generation",
      "Tuning support",
      "Export notation",
    ],
  },
]

export const homeFeature = features[0]

export function getFeature(id: string): Feature {
  return features.find((feature) => feature.id === id) ?? homeFeature
}
