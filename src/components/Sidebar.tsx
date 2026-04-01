import { useState } from "react"
import {
  Music,
  Mic2,
  Radio,
  Sliders,
  Waves,
  Piano,
  Drum,
  Guitar,
  Menu,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

export interface Feature {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

const features: Feature[] = [
  {
    id: "home",
    name: "Home",
    icon: <Music className="size-5" />,
    description: "Dashboard overview",
  },
  {
    id: "mixer",
    name: "Mixer",
    icon: <Sliders className="size-5" />,
    description: "Audio mixing console",
  },
  {
    id: "synth",
    name: "Synthesizer",
    icon: <Waves className="size-5" />,
    description: "Virtual synthesizers",
  },
  {
    id: "sampler",
    name: "Sampler",
    icon: <Radio className="size-5" />,
    description: "Sample library & player",
  },
  {
    id: "recorder",
    name: "Recorder",
    icon: <Mic2 className="size-5" />,
    description: "Audio recording",
  },
  {
    id: "piano",
    name: "Piano Roll",
    icon: <Piano className="size-5" />,
    description: "MIDI piano editor",
  },
  {
    id: "drums",
    name: "Drum Machine",
    icon: <Drum className="size-5" />,
    description: "Beat sequencer",
  },
  {
    id: "guitar",
    name: "Guitar Amp",
    icon: <Guitar className="size-5" />,
    description: "Amp & effects simulation",
  },
]

interface SidebarProps {
  activeFeature: string
  onFeatureSelect: (id: string) => void
}

export function Sidebar({ activeFeature, onFeatureSelect }: SidebarProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          expanded ? "w-56" : "w-16"
        )}
      >
        <div className="flex items-center h-14 px-3 border-b border-sidebar-border">
          {expanded ? (
            <>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <Music className="size-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground truncate">
                  Music Hub
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-sidebar-foreground hover:text-foreground"
                onClick={() => setExpanded(false)}
              >
                <ChevronLeft className="size-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="size-10 mx-auto text-sidebar-foreground hover:text-foreground"
              onClick={() => setExpanded(true)}
            >
              <Menu className="size-5" />
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
            {features.slice(0, 1).map((feature) => (
              <SidebarItem
                key={feature.id}
                feature={feature}
                isActive={activeFeature === feature.id}
                expanded={expanded}
                onClick={() => onFeatureSelect(feature.id)}
              />
            ))}

            <Separator className="my-2 bg-sidebar-border" />

            <div
              className={cn(
                "px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
                !expanded && "sr-only"
              )}
            >
              Tools
            </div>

            {features.slice(1).map((feature) => (
              <SidebarItem
                key={feature.id}
                feature={feature}
                isActive={activeFeature === feature.id}
                expanded={expanded}
                onClick={() => onFeatureSelect(feature.id)}
              />
            ))}
          </nav>
        </ScrollArea>

        <div className="p-3 border-t border-sidebar-border">
          {expanded ? (
            <div className="text-xs text-muted-foreground text-center">
              v0.1.0
            </div>
          ) : (
            <div className="size-2 rounded-full bg-green-500 mx-auto" />
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}

interface SidebarItemProps {
  feature: Feature
  isActive: boolean
  expanded: boolean
  onClick: () => void
}

function SidebarItem({
  feature,
  isActive,
  expanded,
  onClick,
}: SidebarItemProps) {
  const button = (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent",
        expanded ? "px-3" : "px-0 justify-center",
        isActive && "bg-sidebar-accent text-foreground"
      )}
      onClick={onClick}
    >
      {feature.icon}
      {expanded && <span className="truncate">{feature.name}</span>}
    </Button>
  )

  if (!expanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" className="flex flex-col">
          <span className="font-medium">{feature.name}</span>
          <span className="text-muted-foreground">{feature.description}</span>
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

export { features }
