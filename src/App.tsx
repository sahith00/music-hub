import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { FeatureContent } from "@/components/FeatureContent"

function App() {
  const [activeFeature, setActiveFeature] = useState("home")

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
