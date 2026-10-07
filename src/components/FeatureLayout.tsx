import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import type { Feature } from "@/features"

export type FeaturePageProps = {
  feature: Feature
}

interface FeatureLayoutProps {
  feature: Feature
  title?: string
  description?: string
  action?: ReactNode
  showHighlights?: boolean
  children?: ReactNode
}

export function FeatureLayout({
  feature,
  title = feature.name,
  description = feature.description,
  action,
  showHighlights = true,
  children,
}: FeatureLayoutProps) {
  const Icon = feature.icon

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-14 border-b border-border flex items-center px-6">
        <h1 className="text-lg font-semibold">{feature.name}</h1>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div
          className={`rounded-xl bg-linear-to-br ${feature.color} border border-border p-8 mb-8`}
        >
          <div className="flex items-start gap-6">
            <div className="size-20 rounded-2xl bg-background/50 backdrop-blur flex items-center justify-center text-foreground">
              <Icon className="size-12" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                {description}
              </p>
              {action}
            </div>
          </div>
        </div>

        {showHighlights && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {feature.highlights.map((item) => (
              <div
                key={item}
                className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item}</span>
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}

        {children}
      </main>
    </div>
  )
}
