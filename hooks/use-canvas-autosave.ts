"use client"

import { useEffect, useRef, useCallback } from "react"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

interface UseCanvasAutosaveOptions {
  projectId: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  onStatusChange: (status: SaveStatus) => void
  debounceMs?: number
}

export function useCanvasAutosave({
  projectId,
  nodes,
  edges,
  onStatusChange,
  debounceMs = 2000,
}: UseCanvasAutosaveOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Track whether we've received the initial load yet — skip saves until then
  const initializedRef = useRef(false)
  const prevJsonRef = useRef<string>("")

  const save = useCallback(
    async (n: CanvasNode[], e: CanvasEdge[]) => {
      onStatusChange("saving")
      try {
        const res = await fetch(`/api/projects/${projectId}/canvas`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes: n, edges: e }),
        })
        if (!res.ok) throw new Error("Save failed")
        onStatusChange("saved")
      } catch {
        onStatusChange("error")
      }
    },
    [projectId, onStatusChange],
  )

  useEffect(() => {
    if (!initializedRef.current) {
      // Mark initialized after the first render so the next change triggers a save
      initializedRef.current = true
      return
    }

    const json = JSON.stringify({ nodes, edges })
    if (json === prevJsonRef.current) return
    prevJsonRef.current = json

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => save(nodes, edges), debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges])

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])
}
