import type { CanvasNode, CanvasEdge, CanvasEdgeData } from "@/types/canvas"

export type CanvasTemplate = {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

function node(
  id: string,
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  shape: CanvasNode["data"]["shape"],
  color: string,
  textColor: string,
): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    data: { label, shape, color, textColor },
    width: w,
    height: h,
  }
}

function edge(
  id: string,
  source: string,
  target: string,
  arrowType: CanvasEdgeData["arrowType"] = "source-to-target",
): CanvasEdge {
  return { id, type: "canvasEdge", source, target, data: { arrowType } }
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices Architecture",
    description: "API gateway routing to independent services with separate databases.",
    nodes: [
      node("gw",        "API Gateway",     200,  20, 160, 50, "rectangle", "#10233D", "#52A8FF"),
      node("auth",      "Auth Service",     20, 140, 130, 50, "rectangle", "#2E1938", "#BF7AF0"),
      node("user",      "User Service",    200, 140, 130, 50, "rectangle", "#062822", "#0AC7B4"),
      node("order",     "Order Service",   380, 140, 130, 50, "rectangle", "#331B00", "#FF990A"),
      node("user-db",   "User DB",         185, 270, 110, 65, "cylinder",  "#062822", "#0AC7B4"),
      node("order-db",  "Orders DB",       360, 270, 110, 65, "cylinder",  "#331B00", "#FF990A"),
    ],
    edges: [
      edge("e1", "gw",    "auth"),
      edge("e2", "gw",    "user"),
      edge("e3", "gw",    "order"),
      edge("e4", "user",  "user-db"),
      edge("e5", "order", "order-db"),
    ],
  },

  {
    id: "cicd",
    name: "CI/CD Pipeline",
    description: "Automated build, test, and deployment pipeline from commit to production.",
    nodes: [
      node("push",     "Code Push",    20,  95, 110, 46, "pill",      "#10233D", "#52A8FF"),
      node("build",    "Build",       160,  95, 100, 46, "rectangle", "#331B00", "#FF990A"),
      node("test",     "Test",        290,  85, 100, 60, "diamond",   "#062822", "#0AC7B4"),
      node("docker",   "Docker Build",420,  95, 120, 46, "rectangle", "#2E1938", "#BF7AF0"),
      node("registry", "Registry",    420, 230, 110, 60, "cylinder",  "#1F1F1F", "#EDEDED"),
      node("staging",  "Staging",     290, 240, 110, 50, "hexagon",   "#10233D", "#52A8FF"),
      node("e2e",      "E2E Tests",   160, 230, 110, 60, "diamond",   "#331B00", "#FF990A"),
      node("prod",     "Production",   20, 240, 110, 50, "hexagon",   "#0F2E18", "#62C073"),
    ],
    edges: [
      edge("e1", "push",     "build"),
      edge("e2", "build",    "test"),
      edge("e3", "test",     "docker"),
      edge("e4", "docker",   "registry"),
      edge("e5", "registry", "staging"),
      edge("e6", "staging",  "e2e"),
      edge("e7", "e2e",      "prod"),
    ],
  },

  {
    id: "event-driven",
    name: "Event-Driven System",
    description: "Producers publish events to a central bus consumed by independent services.",
    nodes: [
      node("order-svc",   "Order Service",    20,  80, 130, 46, "rectangle", "#331B00", "#FF990A"),
      node("payment-svc", "Payment Service",  20, 200, 130, 46, "rectangle", "#3A1726", "#F75F8F"),
      node("event-bus",   "Event Bus",       200, 125, 150, 50, "pill",      "#2E1938", "#BF7AF0"),
      node("inventory",   "Inventory",       400,  60, 120, 46, "rectangle", "#062822", "#0AC7B4"),
      node("notify",      "Notifications",   400, 160, 120, 46, "rectangle", "#10233D", "#52A8FF"),
      node("analytics",   "Analytics",       400, 260, 120, 46, "rectangle", "#0F2E18", "#62C073"),
      node("dlq",         "Dead Letter Queue",195, 280, 150, 60, "cylinder",  "#3C1618", "#FF6166"),
    ],
    edges: [
      edge("e1", "order-svc",   "event-bus"),
      edge("e2", "payment-svc", "event-bus"),
      edge("e3", "event-bus",   "inventory"),
      edge("e4", "event-bus",   "notify"),
      edge("e5", "event-bus",   "analytics"),
      edge("e6", "event-bus",   "dlq"),
    ],
  },
]
