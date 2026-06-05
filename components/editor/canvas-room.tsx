"use client"

import { ClientSideSuspense } from "@liveblocks/react"
import { CanvasFlow } from "./canvas-flow"
import type { CanvasTemplate } from "./starter-templates"
import type { SaveStatus } from "@/hooks/use-canvas-autosave"

interface CanvasRoomProps {
  projectId: string
  pendingTemplate?: CanvasTemplate | null
  onTemplateConsumed?: () => void
  onSaveStatusChange?: (status: SaveStatus) => void
}

function CanvasLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
    </div>
  )
}

function CanvasError() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Failed to connect to canvas. Please refresh.</p>
    </div>
  )
}

export function CanvasRoom({ projectId, pendingTemplate, onTemplateConsumed, onSaveStatusChange }: CanvasRoomProps) {
  return (
    <ClientSideSuspense fallback={<CanvasLoading />}>
      {() => (
        <ErrorBoundaryCanvas>
          <CanvasFlow
            projectId={projectId}
            pendingTemplate={pendingTemplate}
            onTemplateConsumed={onTemplateConsumed}
            onSaveStatusChange={onSaveStatusChange}
          />
        </ErrorBoundaryCanvas>
      )}
    </ClientSideSuspense>
  )
}

import { Component, type ReactNode } from "react"

class ErrorBoundaryCanvas extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return <CanvasError />
    return this.props.children
  }
}
