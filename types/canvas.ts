import type { Node, Edge } from "@xyflow/react";

export type CanvasShape =
  | "rectangle"
  | "circle"
  | "diamond"
  | "pill"
  | "cylinder"
  | "hexagon";

export type CanvasNodeData = {
  label: string;
  color?: string;
  shape?: CanvasShape;
};

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<Record<string, never>, "canvasEdge">;
