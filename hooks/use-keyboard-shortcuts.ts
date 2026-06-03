"use client"

import { useEffect } from "react"

interface ZoomControls {
  zoomIn: (options?: { duration?: number }) => void
  zoomOut: (options?: { duration?: number }) => void
  fitView: (options?: { duration?: number }) => void
}

interface UseKeyboardShortcutsOptions {
  instance?: ZoomControls | null
  undo?: () => void
  redo?: () => void
  toggleSidebar?: () => void
  toggleAI?: () => void
}

function isEditingField(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement
  if (!target) return false
  const tag = target.tagName.toLowerCase()
  return tag === "input" || tag === "textarea" || target.isContentEditable
}

export function useKeyboardShortcuts({
  instance,
  undo,
  redo,
  toggleSidebar,
  toggleAI,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isEditingField(e)) return

      const ctrl = e.metaKey || e.ctrlKey

      if (!ctrl && !e.altKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault()
        instance?.zoomIn({ duration: 200 })
        return
      }
      if (!ctrl && !e.altKey && e.key === "-") {
        e.preventDefault()
        instance?.zoomOut({ duration: 200 })
        return
      }
      if (ctrl && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault()
        redo?.()
        return
      }
      if (ctrl && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault()
        undo?.()
        return
      }
      if (ctrl && e.key.toLowerCase() === "y") {
        e.preventDefault()
        redo?.()
        return
      }
      if (e.altKey && (e.key.toLowerCase() === "a" || e.code === "KeyA")) {
        e.preventDefault()
        toggleSidebar?.()
        return
      }
      if (e.altKey && (e.key.toLowerCase() === "s" || e.code === "KeyS")) {
        e.preventDefault()
        toggleAI?.()
        return
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [instance, undo, redo, toggleSidebar, toggleAI])
}
