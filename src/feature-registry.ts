import type { ComponentType } from "react"
import type { FeatureId } from "@/features"
import type { FeaturePageProps } from "@/components/FeatureLayout"
import { HomePage } from "@/components/feature-pages/HomePage"
import { PlaceholderFeaturePage } from "@/components/feature-pages/PlaceholderFeaturePage"
import { SpotifyHomePage } from "@/components/feature-pages/SpotifyHomePage"

export type FeaturePage = ComponentType<FeaturePageProps>

/**
 * Explicit map of catalog ids to page components.
 * Omit an id to use PlaceholderFeaturePage (shared Coming soon chrome).
 */
const featureRegistry: Partial<Record<FeatureId, FeaturePage>> = {
  home: HomePage,
  spotify: SpotifyHomePage,
}

export function getFeaturePage(id: FeatureId): FeaturePage {
  return featureRegistry[id] ?? PlaceholderFeaturePage
}
