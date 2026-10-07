import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { FeatureContent } from "@/components/FeatureContent"
import type { FeatureId } from "@/features"

/*
  Catalog: src/features.ts. Pages: src/feature-registry.ts.
*/

function App() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>("home")

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeFeature={activeFeature}
        onFeatureSelect={setActiveFeature}
      />
      <FeatureContent featureId={activeFeature} />
    </div>
  )
}

export default App
