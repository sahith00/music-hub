import { getFeature } from "@/features"
import { getFeaturePage } from "@/feature-registry"

interface FeatureContentProps {
  featureId: string
}

export function FeatureContent({ featureId }: FeatureContentProps) {
  const feature = getFeature(featureId)
  const Page = getFeaturePage(feature.id)
  return <Page feature={feature} />
}
