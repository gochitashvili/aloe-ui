"use client"

import {
  ComponentControls,
  ControlColor,
  ControlSlider,
  ControlSwitch,
} from "@/components/component-controls"
import { ComponentPreview } from "@/components/component-preview"
import { usePreviewProps } from "@/hooks/use-preview-props"
import { AsciiFluid } from "@/registry/ascii-fluid/ascii-fluid"

const DEFAULTS = {
  cellSize: 12,
  force: 1,
  dissipation: 0.05,
  brush: 0.55,
  animate: true,
  color: "#18181B",
  backgroundColor: "#FAFAFA",
}

export function AsciiFluidDemo() {
  const { props, updateProp, resetProps, hasChanges } =
    usePreviewProps(DEFAULTS)

  return (
    <>
      <ComponentPreview
        title="ASCII Fluid"
        stageClassName="min-h-0 overflow-hidden p-0"
      >
        <div className="relative h-[56svh] w-full overflow-hidden rounded-[inherit] bg-background">
          <AsciiFluid
            className="absolute inset-0"
            cellSize={props.cellSize}
            force={props.force}
            dissipation={props.dissipation}
            brush={props.brush}
            animate={props.animate}
            color={props.color}
            backgroundColor={props.backgroundColor}
          />
        </div>
      </ComponentPreview>

      <ComponentControls hasChanges={hasChanges} onReset={resetProps}>
        <ControlColor
          label="Ink"
          value={props.color}
          onChange={(v) => updateProp("color", v)}
        />
        <ControlColor
          label="Paper"
          value={props.backgroundColor}
          onChange={(v) => updateProp("backgroundColor", v)}
        />
        <ControlSlider
          label="Cell size"
          value={props.cellSize}
          min={6}
          max={24}
          step={1}
          onChange={(v) => updateProp("cellSize", v)}
        />
        <ControlSlider
          label="Force"
          value={props.force}
          min={0.2}
          max={2.5}
          step={0.1}
          onChange={(v) => updateProp("force", v)}
        />
        <ControlSlider
          label="Dissipation"
          value={props.dissipation}
          min={0.01}
          max={0.2}
          step={0.01}
          onChange={(v) => updateProp("dissipation", v)}
        />
        <ControlSlider
          label="Brush"
          value={props.brush}
          min={0.15}
          max={1}
          step={0.05}
          onChange={(v) => updateProp("brush", v)}
        />
        <ControlSwitch
          label="Animate"
          description="Soft ambient swirl when idle"
          checked={props.animate}
          onChange={(v) => updateProp("animate", v)}
        />
      </ComponentControls>
    </>
  )
}
