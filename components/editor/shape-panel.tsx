"use client"

import { useState, useCallback } from "react"
import { RectangleHorizontal, Diamond, Circle, Pill, Cylinder, Hexagon } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { CanvasShape } from "@/types/canvas"
import { ShapeRenderer } from "./shape-renderer"

export const SHAPE_DRAG_TYPE = "application/canvas-shape"

export type ShapeDragPayload = {
  shape: CanvasShape
  width: number
  height: number
}

type ShapeConfig = {
  shape: CanvasShape
  icon: LucideIcon
  width: number
  height: number
  label: string
}

const SHAPES: ShapeConfig[] = [
  { shape: "rectangle", icon: RectangleHorizontal, width: 180, height: 80,  label: "Rectangle" },
  { shape: "diamond",   icon: Diamond,             width: 140, height: 140, label: "Diamond"   },
  { shape: "circle",    icon: Circle,              width: 100, height: 100, label: "Circle"    },
  { shape: "pill",      icon: Pill,                width: 160, height: 70,  label: "Pill"      },
  { shape: "cylinder",  icon: Cylinder,            width: 120, height: 100, label: "Cylinder"  },
  { shape: "hexagon",   icon: Hexagon,             width: 120, height: 120, label: "Hexagon"   },
]

type GhostState = {
  shape: CanvasShape
  width: number
  height: number
  x: number
  y: number
}

export function ShapePanel() {
  const [ghost, setGhost] = useState<GhostState | null>(null)

  const onDragStart = useCallback((event: React.DragEvent, config: ShapeConfig) => {
    const payload: ShapeDragPayload = { shape: config.shape, width: config.width, height: config.height }
    event.dataTransfer.setData(SHAPE_DRAG_TYPE, JSON.stringify(payload))
    event.dataTransfer.effectAllowed = "copy"

    // Suppress the native drag ghost with a transparent 1×1 canvas
    const blank = document.createElement("canvas")
    blank.width = 1
    blank.height = 1
    event.dataTransfer.setDragImage(blank, 0, 0)

    setGhost({ shape: config.shape, width: config.width, height: config.height, x: event.clientX, y: event.clientY })

    const onMove = (e: MouseEvent) => {
      setGhost(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
    }
    const onEnd = () => {
      setGhost(null)
      document.removeEventListener("mousemove", onMove)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("dragend", onEnd, { once: true })
  }, [])

  return (
    <>
      {ghost && (
        <div
          style={{
            position: "fixed",
            left: ghost.x - ghost.width / 2,
            top: ghost.y - ghost.height / 2,
            width: ghost.width,
            height: ghost.height,
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0.55,
          }}
        >
          <ShapeRenderer shape={ghost.shape} />
        </div>
      )}
      <div className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/90 px-3 py-2 shadow-lg backdrop-blur-sm">
        {SHAPES.map((config) => {
          const Icon = config.icon
          return (
            <button
              key={config.shape}
              draggable
              onDragStart={(e) => onDragStart(e, config)}
              title={config.label}
              className="flex h-8 w-8 cursor-grab items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100 active:cursor-grabbing"
            >
              <Icon size={16} />
            </button>
          )
        })}
      </div>
    </>
  )
}
