"use client"

import {
  ComponentControls,
  ControlColors,
  ControlSlider,
  ControlSwitch,
} from "@/components/component-controls"
import { ComponentPreview } from "@/components/component-preview"
import { usePreviewProps } from "@/hooks/use-preview-props"
import { ShaderGradient } from "@/registry/shader-gradient/shader-gradient"

const DEFAULTS = {
  speed: 0.14,
  blur: 0.7,
  intensity: 0.95,
  interactive: true,
  colors: ["#7CB4E0", "#B4D8C4", "#EFE4BC", "#D2D7EC"],
}

export function ShaderGradientDemo() {
  const { props, updateProp, resetProps, hasChanges } =
    usePreviewProps(DEFAULTS)

  return (
    <>
      <ComponentPreview
        title="Shader Gradient"
        stageClassName="min-h-0 overflow-hidden p-0"
      >
        <div className="relative h-[56svh] w-full overflow-hidden rounded-[inherit] bg-background">
          <ShaderGradient
            className="absolute inset-0"
            speed={props.speed}
            blur={props.blur}
            intensity={props.intensity}
            interactive={props.interactive}
            colors={props.colors}
          />
        </div>
      </ComponentPreview>

      <ComponentControls hasChanges={hasChanges} onReset={resetProps}>
        <ControlColors
          label="Palette"
          colors={props.colors}
          swatchLabels={["Sky", "Sage", "Cream", "Lavender"]}
          onChange={(colors) => updateProp("colors", colors)}
        />
        <ControlSlider
          label="Speed"
          value={props.speed}
          min={0.02}
          max={0.6}
          step={0.02}
          onChange={(v) => updateProp("speed", v)}
        />
        <ControlSlider
          label="Blur"
          value={props.blur}
          min={0.2}
          max={1}
          step={0.05}
          onChange={(v) => updateProp("blur", v)}
        />
        <ControlSlider
          label="Intensity"
          value={props.intensity}
          min={0.3}
          max={1}
          step={0.05}
          onChange={(v) => updateProp("intensity", v)}
        />
        <ControlSwitch
          label="Interactive"
          description="Follow the pointer"
          checked={props.interactive}
          onChange={(v) => updateProp("interactive", v)}
        />
      </ComponentControls>
    </>
  )
}
