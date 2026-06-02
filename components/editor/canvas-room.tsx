"use client"

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react"
import { LiveObject, LiveMap } from "@liveblocks/client"
import { CanvasFlow } from "./canvas-flow"

interface CanvasRoomProps {
  roomId: string
}

function CanvasError() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Failed to connect to canvas. Please refresh.</p>
    </div>
  )
}

function CanvasLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
    </div>
  )
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
        initialStorage={{
          flow: new LiveObject({
            nodes: new LiveMap(),
            edges: new LiveMap(),
          }),
        }}
      >
        <ClientSideSuspense fallback={<CanvasLoading />}>
          {() => (
            <ErrorBoundaryCanvas>
              <CanvasFlow />
            </ErrorBoundaryCanvas>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
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
