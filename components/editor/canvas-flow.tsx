"use client"

import "@xyflow/react/dist/style.css"
import { memo, useCallback, useRef } from "react"
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  Panel,
  type ReactFlowInstance,
  type NodeProps,
} from "@xyflow/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"
import { ShapePanel, SHAPE_DRAG_TYPE, type ShapeDragPayload } from "./shape-panel"

let nodeCounter = 0

const CanvasNodeComponent = memo(({ data }: NodeProps<CanvasNode>) => (
  <div className="flex h-full w-full items-center justify-center rounded border border-zinc-600 bg-zinc-800/80 text-sm text-zinc-200">
    {data.label || data.shape}
  </div>
))
CanvasNodeComponent.displayName = "CanvasNodeComponent"

const nodeTypes = { canvasNode: CanvasNodeComponent }
const edgeTypes = {}

export function CanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  const instanceRef = useRef<ReactFlowInstance<CanvasNode, CanvasEdge> | null>(null)

  const onInit = useCallback((instance: ReactFlowInstance<CanvasNode, CanvasEdge>) => {
    instanceRef.current = instance
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const raw = event.dataTransfer.getData(SHAPE_DRAG_TYPE)
      if (!raw || !instanceRef.current) return

      const { shape, width, height } = JSON.parse(raw) as ShapeDragPayload
      const position = instanceRef.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      onNodesChange([
        {
          type: "add",
          item: {
            id: `${shape}-${Date.now()}-${++nodeCounter}`,
            type: "canvasNode",
            position: { x: position.x - width / 2, y: position.y - height / 2 },
            data: { label: "", shape },
            width,
            height,
          },
        },
      ])
    },
    [onNodesChange],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      onInit={onInit}
      onDragOver={onDragOver}
      onDrop={onDrop}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionMode={ConnectionMode.Loose}
      fitView
      colorMode="dark"
    >
      <Background
        variant={BackgroundVariant.Lines}
        gap={24}
        lineWidth={1}
        color="rgba(255,255,255,0.06)"
      />
      <MiniMap
        nodeColor="#3f3f46"
        maskColor="rgba(0,0,0,0.6)"
        style={{ background: "#18181c" }}
      />
      <Panel position="bottom-center" style={{ marginBottom: "16px" }}>
        <ShapePanel />
      </Panel>
    </ReactFlow>
  )
}
