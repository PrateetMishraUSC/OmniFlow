"use client"

import type { CanvasShape } from "@/types/canvas"

type Props = {
  shape: CanvasShape
  selected?: boolean
  fillColor?: string
}

const REST_STROKE = "rgba(255,255,255,0.22)"
const SEL_STROKE  = "rgba(255,255,255,0.75)"
const DEFAULT_FILL = "rgba(39,39,42,0.85)"
const SW           = 1.5

export function ShapeRenderer({ shape, selected, fillColor }: Props) {
  const stroke = selected ? SEL_STROKE : REST_STROKE
  const fill = fillColor ?? DEFAULT_FILL

  if (shape === "rectangle") {
    return (
      <div
        className="h-full w-full rounded-sm"
        style={{ border: `${SW}px solid ${stroke}`, background: fill }}
      />
    )
  }

  if (shape === "pill" || shape === "circle") {
    return (
      <div
        className="h-full w-full rounded-full"
        style={{ border: `${SW}px solid ${stroke}`, background: fill }}
      />
    )
  }

  if (shape === "diamond") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="50,2 98,50 50,98 2,50"
          fill={fill}
          stroke={stroke}
          strokeWidth={SW}
        />
      </svg>
    )
  }

  if (shape === "hexagon") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="50,2 98,26 98,74 50,98 2,74 2,26"
          fill={fill}
          stroke={stroke}
          strokeWidth={SW}
        />
      </svg>
    )
  }

  if (shape === "cylinder") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="2" y="18" width="96" height="66" fill={fill} />
        <ellipse cx="50" cy="84" rx="48" ry="14" fill={fill} stroke={stroke} strokeWidth={SW} />
        <line x1="2" y1="18" x2="2" y2="84" stroke={stroke} strokeWidth={SW} />
        <line x1="98" y1="18" x2="98" y2="84" stroke={stroke} strokeWidth={SW} />
        <ellipse cx="50" cy="18" rx="48" ry="14" fill={fill} stroke={stroke} strokeWidth={SW} />
      </svg>
    )
  }

  return null
}
