import {
  Music,
  Mic2,
  Radio,
  Sliders,
  Waves,
  Piano,
  Drum,
  Guitar,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeatureContentProps {
  featureId: string
}

const featureData: Record<
  string,
  {
    title: string
    description: string
    icon: React.ReactNode
    color: string
    features: string[]
  }
> = {
  home: {
    title: "Music Hub",
    description:
      "Your all-in-one music production workspace. Select a tool from the sidebar to get started.",
    icon: <Music className="size-12" />,
    color: "from-primary/20 to-primary/5",
    features: [
      "Professional-grade audio tools",
      "Intuitive workflow design",
      "Real-time collaboration",
      "Cloud project storage",
    ],
  },
  mixer: {
    title: "Mixer",
    description:
      "Professional mixing console with multi-track support, EQ, compression, and effects routing.",
    icon: <Sliders className="size-12" />,
    color: "from-blue-500/20 to-blue-500/5",
    features: [
      "Unlimited tracks",
      "Built-in EQ & dynamics",
      "Aux sends & returns",
      "Automation lanes",
    ],
  },
  synth: {
    title: "Synthesizer",
    description:
      "Powerful virtual synthesizers with wavetable, subtractive, and FM synthesis engines.",
    icon: <Waves className="size-12" />,
    color: "from-purple-500/20 to-purple-500/5",
    features: [
      "Multiple synthesis types",
      "Preset library",
      "Modulation matrix",
      "MIDI learn support",
    ],
  },
  sampler: {
    title: "Sampler",
    description:
      "Advanced sample playback and manipulation with slicing, stretching, and layering.",
    icon: <Radio className="size-12" />,
    color: "from-green-500/20 to-green-500/5",
    features: [
      "Drag & drop samples",
      "Auto-slice detection",
      "Time stretching",
      "Round-robin playback",
    ],
  },
  recorder: {
    title: "Recorder",
    description:
      "High-quality audio recording with input monitoring, punch-in, and loop recording.",
    icon: <Mic2 className="size-12" />,
    color: "from-red-500/20 to-red-500/5",
    features: [
      "Multi-track recording",
      "Low-latency monitoring",
      "Punch in/out",
      "Take management",
    ],
  },
  piano: {
    title: "Piano Roll",
    description:
      "Intuitive MIDI editor with quantization, velocity editing, and chord tools.",
    icon: <Piano className="size-12" />,
    color: "from-amber-500/20 to-amber-500/5",
    features: [
      "Note editing",
      "Velocity curves",
      "Chord detection",
      "Scale highlighting",
    ],
  },
  drums: {
    title: "Drum Machine",
    description:
      "Step sequencer and drum pad interface with pattern chaining and swing control.",
    icon: <Drum className="size-12" />,
    color: "from-orange-500/20 to-orange-500/5",
    features: [
      "16-step sequencer",
      "Pattern chaining",
      "Swing & groove",
      "Kit customization",
    ],
  },
  guitar: {
    title: "Guitar Amp",
    description:
      "Realistic amp modeling with cabinet simulation, pedals, and effects chains.",
    icon: <Guitar className="size-12" />,
    color: "from-cyan-500/20 to-cyan-500/5",
    features: [
      "Amp modeling",
      "Cabinet IRs",
      "Pedal effects",
      "Preset management",
    ],
  },
}

export function FeatureContent({ featureId }: FeatureContentProps) {
  const feature = featureData[featureId] || featureData.home

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-border flex items-center px-6">
        <h1 className="text-lg font-semibold">{feature.title}</h1>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div
          className={`rounded-xl bg-gradient-to-br ${feature.color} border border-border p-8 mb-8`}
        >
          <div className="flex items-start gap-6">
            <div className="size-20 rounded-2xl bg-background/50 backdrop-blur flex items-center justify-center text-foreground">
              {feature.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                {feature.description}
              </p>
              {featureId !== "home" && (
                <Button className="mt-4 gap-2">
                  <Sparkles className="size-4" />
                  Launch {feature.title}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feature.features.map((item, index) => (
            <div
              key={index}
              className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item}</span>
                <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {featureId === "home" && (
          <>
            <h3 className="text-lg font-semibold mt-8 mb-4">Quick Start</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "New Project",
                  desc: "Start fresh with a blank canvas",
                },
                {
                  title: "Open Recent",
                  desc: "Continue where you left off",
                },
                {
                  title: "Browse Templates",
                  desc: "Start from a template",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
