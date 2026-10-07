import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  FeatureLayout,
  type FeaturePageProps,
} from "@/components/FeatureLayout"

export function PlaceholderFeaturePage({ feature }: FeaturePageProps) {
  return (
    <FeatureLayout
      feature={feature}
      action={
        <Button className="mt-4 gap-2">
          <Sparkles className="size-4" />
          Coming soon
        </Button>
      }
    />
  )
}
