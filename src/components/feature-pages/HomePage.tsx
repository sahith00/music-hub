import { HomeProfiles } from "@/components/HomeProfiles"
import {
  FeatureLayout,
  type FeaturePageProps,
} from "@/components/FeatureLayout"

const quickStartItems = [
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
]

export function HomePage({ feature }: FeaturePageProps) {
  return (
    <FeatureLayout
      feature={feature}
      title="Music Hub"
      description="Your all-in-one music production workspace. Select a tool from the sidebar to get started."
    >
      <h3 className="text-lg font-semibold mt-8 mb-4">Quick Start</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStartItems.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <h4 className="font-medium mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <HomeProfiles />
    </FeatureLayout>
  )
}
