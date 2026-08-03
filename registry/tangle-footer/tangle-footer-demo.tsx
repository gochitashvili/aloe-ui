"use client"

import {
  ComponentControls,
  ControlColor,
  ControlSlider,
} from "@/components/component-controls"
import { ComponentPreview } from "@/components/component-preview"
import { usePreviewProps } from "@/hooks/use-preview-props"
import { TangleFooter } from "@/registry/tangle-footer/tangle-footer"

const DEFAULTS = {
  height: 280,
  seed: 23,
  ribbon: "#1A1916",
  textColor: "#EFEAE2",
  stage: "#EFEAE2",
}

const LINES = [
  "Ship something opinionated — less boilerplate, clearer decisions. ",
  "Knows what’s going on. Can you check in with them and see what’s next. ",
  "The new timeline should be ready by Friday, although it’s probably going to slip. ",
  "Open the docs, grab a component, and make it yours in the codebase. ",
  "Radiant lines, shader wash, gooey picker — install what you need and move. ",
]

export function TangleFooterDemo() {
  const { props, updateProp, resetProps, hasChanges } =
    usePreviewProps(DEFAULTS)

  return (
    <>
      <ComponentPreview
        title="Tangle Footer"
        stageClassName="min-h-0 overflow-hidden p-0"
        align="start"
      >
        <div
          className="flex h-[56svh] w-full flex-col justify-end overflow-hidden rounded-[inherit]"
          style={{ backgroundColor: props.stage }}
        >
          <div className="w-full max-w-7xl self-center">
            <TangleFooter
              background="transparent"
              height={props.height}
              seed={props.seed}
              ribbon={props.ribbon}
              textColor={props.textColor}
              lines={LINES}
            />
          </div>
        </div>
      </ComponentPreview>

      <ComponentControls hasChanges={hasChanges} onReset={resetProps}>
        <ControlColor
          label="Stage"
          value={props.stage}
          onChange={(v) => updateProp("stage", v)}
        />
        <ControlColor
          label="Ribbon"
          value={props.ribbon}
          onChange={(v) => updateProp("ribbon", v)}
        />
        <ControlColor
          label="Text"
          value={props.textColor}
          onChange={(v) => updateProp("textColor", v)}
        />
        <ControlSlider
          label="Height"
          value={props.height}
          min={160}
          max={420}
          step={10}
          onChange={(v) => updateProp("height", v)}
        />
        <ControlSlider
          label="Seed"
          value={props.seed}
          min={1}
          max={100}
          step={1}
          onChange={(v) => updateProp("seed", v)}
        />
      </ComponentControls>
    </>
  )
}
