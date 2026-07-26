"use client"

import Image from "next/image"
import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadiantLines } from "@/registry/radiant-lines/radiant-lines"
import { ShaderGradient } from "@/registry/shader-gradient/shader-gradient"

const BACKGROUNDS = [
  { value: "radiant-lines", label: "Radiant Lines" },
  { value: "shader-gradient", label: "Shader Gradient" },
] as const

type Background = (typeof BACKGROUNDS)[number]["value"]

export default function DemoPage() {
  const [background, setBackground] = useState<Background>("shader-gradient")

  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 w-screen">
        {background === "radiant-lines" ? (
          <RadiantLines className="absolute inset-0" />
        ) : (
          <ShaderGradient className="absolute inset-0" />
        )}
      </div>

      <div className="sticky top-5 z-20 flex justify-center px-6">
        <Select
          value={background}
          onValueChange={(value) => {
            if (value === "radiant-lines" || value === "shader-gradient") {
              setBackground(value)
            }
          }}
          items={BACKGROUNDS.map(({ value, label }) => ({ value, label }))}
        >
          <SelectTrigger
            aria-label="Background"
            className="bg-background/70 backdrop-blur-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {BACKGROUNDS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <section className="relative z-10 flex min-h-svh flex-col items-center">
        <div className="flex flex-1 flex-col items-center justify-center px-6 pt-8 text-center">
          <h1 className="max-w-xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Backgrounds for your next interface
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pick a live background from the library and see how it sits behind
            a simple centered layout.
          </p>
        </div>

        <div className="w-full max-w-4xl px-6 pb-16">
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <Image
              src="/demo-product.png"
              alt="Product preview"
              width={1600}
              height={900}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
