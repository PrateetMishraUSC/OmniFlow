import { task, metadata } from "@trigger.dev/sdk/v3";
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { LiveObject, LiveMap } from "@liveblocks/core";
import { getLiveblocksClient } from "@/lib/liveblocks";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

const AI_USER_ID = "ai-design-agent";

const CANVAS_SHAPES = ["rectangle", "circle", "diamond", "pill", "cylinder", "hexagon"] as const;
const ARROW_TYPES = ["source-to-target", "target-to-source", "bidirectional"] as const;

const NODE_COLORS = [
  { bg: "#1F1F1F", text: "#EDEDED" },
  { bg: "#10233D", text: "#52A8FF" },
  { bg: "#2E1938", text: "#BF7AF0" },
  { bg: "#331B00", text: "#FF990A" },
  { bg: "#3C1618", text: "#FF6166" },
  { bg: "#3A1726", text: "#F75F8F" },
  { bg: "#0F2E18", text: "#62C073" },
  { bg: "#062822", text: "#0AC7B4" },
] as const;

const colorByBg: Map<string, string> = new Map(NODE_COLORS.map((c) => [c.bg, c.text]));

const SYSTEM_PROMPT = `You are an AI that designs system architecture diagrams on a collaborative canvas.

STRICT SEQUENCE — follow this exact order:
1. Call addNode for EVERY node in the design (all of them, no skipping)
2. Call addEdge to connect EVERY pair of nodes that communicate
3. Call finishDesign last with a one-sentence summary

You MUST call addEdge after placing nodes. Do NOT call finishDesign until all edges are added.

Available node shapes: rectangle, circle, diamond, pill, cylinder, hexagon
Use shapes meaningfully:
- rectangle: services, servers, application layers (generic)
- circle: users, clients, external actors
- diamond: routing, load balancers, decision points
- pill: APIs, endpoints, interfaces, proxies
- cylinder: databases, caches, message queues, storage
- hexagon: microservices, containers, isolated modules

Available node bg colors (use exactly these hex values):
- "#10233D" (blue) — APIs, web services, application layers
- "#0F2E18" (green) — databases, persistent storage
- "#2E1938" (purple) — async queues, event buses, pub/sub
- "#331B00" (orange) — gateways, load balancers, proxies
- "#062822" (teal) — caches, CDNs, read replicas
- "#3C1618" (red) — security, auth, rate limiters
- "#3A1726" (pink) — monitoring, logging, analytics
- "#1F1F1F" (dark) — utility services, background workers

Layout rules:
- Start at x=100, y=150 for first nodes
- Space nodes 280px horizontally, 220px vertically
- Flow left-to-right or top-to-bottom
- Cluster related services spatially
- Default width=160, height=60; use width=180 for labels longer than 20 chars

Edge rules:
- Every node MUST have at least one edge — no isolated nodes
- Use arrowType "source-to-target" for unidirectional calls
- Use "bidirectional" for mutual connections
- Add short edge labels for protocol or action (e.g. "HTTPS", "SQL", "publish")

Generate IDs as kebab-case slugs: "api-gateway", "user-service", "redis-cache".`;

const canvasTools = {
  addNode: tool({
    description: "Add a new node to the canvas",
    inputSchema: z.object({
      id: z.string().describe("Unique kebab-case slug, e.g. 'api-gateway'"),
      label: z.string().describe("Display label shown on the node"),
      shape: z.enum(CANVAS_SHAPES),
      colorBg: z.string().describe("Background color hex from the allowed palette"),
      x: z.number().describe("X position on canvas"),
      y: z.number().describe("Y position on canvas"),
      width: z.number().optional().describe("Width in pixels, default 160"),
      height: z.number().optional().describe("Height in pixels, default 60"),
    }),
  }),
  moveNode: tool({
    description: "Move an existing node to a new position",
    inputSchema: z.object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
    }),
  }),
  resizeNode: tool({
    description: "Resize an existing node",
    inputSchema: z.object({
      id: z.string(),
      width: z.number(),
      height: z.number(),
    }),
  }),
  updateNodeData: tool({
    description: "Update the label, color, or shape of an existing node",
    inputSchema: z.object({
      id: z.string(),
      label: z.string().optional(),
      colorBg: z.string().optional(),
      shape: z.enum(CANVAS_SHAPES).optional(),
    }),
  }),
  deleteNode: tool({
    description: "Delete a node from the canvas",
    inputSchema: z.object({ id: z.string() }),
  }),
  addEdge: tool({
    description: "Add a directed edge between two nodes",
    inputSchema: z.object({
      id: z.string().describe("Unique edge ID, e.g. 'edge-gateway-service'"),
      source: z.string().describe("Source node ID"),
      target: z.string().describe("Target node ID"),
      label: z.string().optional().describe("Short protocol or action label"),
      arrowType: z.enum(ARROW_TYPES).optional(),
    }),
  }),
  deleteEdge: tool({
    description: "Delete an edge from the canvas",
    inputSchema: z.object({ id: z.string() }),
  }),
  finishDesign: tool({
    description: "Call this last to signal the design is complete",
    inputSchema: z.object({
      summary: z.string().describe("One sentence describing what was designed"),
    }),
  }),
};

function setStatus(status: string, message: string) {
  metadata.set("status", status);
  metadata.set("message", message);
}

export const designAgent = task({
  id: "design-agent",
  run: async (payload: { prompt: string; roomId: string; userId?: string }) => {
    const { prompt, roomId } = payload;
    const liveblocks = getLiveblocksClient();

    setStatus("thinking", "Analyzing your request…");

    await liveblocks.setPresence(roomId, {
      userId: AI_USER_ID,
      data: { cursor: null, thinking: true },
      userInfo: { displayName: "AI Architect", avatarUrl: "", cursorColor: "#f0a030" },
      ttl: 120_000,
    }).catch(() => {});

    await liveblocks.broadcastEvent(roomId, {
      type: "ai-status",
      status: "thinking",
      message: "Analyzing your request…",
    }).catch(() => {});

    try {
      let existingNodes: Array<{ id: string; label: string }> = [];
      let existingEdges: Array<{ id: string; source: string; target: string }> = [];
      try {
        const storage = await liveblocks.getStorageDocument(roomId, "json");
        const flow = (storage as Record<string, unknown>)?.flow as Record<string, unknown> | undefined;
        if (flow) {
          const nodesObj = (flow.nodes ?? {}) as Record<string, unknown>;
          const edgesObj = (flow.edges ?? {}) as Record<string, unknown>;
          existingNodes = Object.values(nodesObj).map((n: unknown) => {
            const node = n as Record<string, unknown>;
            const data = node.data as Record<string, unknown> | undefined;
            return { id: node.id as string, label: (data?.label as string) ?? "" };
          });
          existingEdges = Object.values(edgesObj).map((e: unknown) => {
            const edge = e as Record<string, unknown>;
            return { id: edge.id as string, source: edge.source as string, target: edge.target as string };
          });
        }
      } catch {
        // Room may not have storage yet — proceed with empty canvas context
      }

      setStatus("processing", "Designing your architecture…");
      await liveblocks.broadcastEvent(roomId, {
        type: "ai-status",
        status: "processing",
        message: "Designing your architecture…",
      }).catch(() => {});

      const contextLine =
        existingNodes.length > 0
          ? `Existing canvas has ${existingNodes.length} nodes: ${JSON.stringify(existingNodes)} and ${existingEdges.length} edges: ${JSON.stringify(existingEdges)}. Extend this design without duplicating existing IDs.`
          : "The canvas is currently empty. Generate a complete initial architecture.";

      const result = await generateText({
        model: google("gemini-2.5-flash"),
        tools: canvasTools,
        system: SYSTEM_PROMPT,
        prompt: `${contextLine}\n\nUser request: ${prompt}`,
      });

      const toolCalls = result.staticToolCalls;

      const finishCall = toolCalls.find((tc) => tc.toolName === "finishDesign");
      const summary = finishCall ? finishCall.input.summary : "Design complete.";

      const addedNodes = toolCalls.filter((tc) => tc.toolName === "addNode").length;
      const addedEdges = toolCalls.filter((tc) => tc.toolName === "addEdge").length;
      const applyingMsg = `Placing ${addedNodes} nodes and ${addedEdges} connections…`;

      setStatus("applying", applyingMsg);
      await liveblocks.broadcastEvent(roomId, {
        type: "ai-status",
        status: "applying",
        message: applyingMsg,
      }).catch(() => {});

      try {
      await liveblocks.mutateStorage(roomId, ({ root }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let flow = root.get("flow") as any;

        // Initialize storage structure if first run (no client has connected yet)
        if (!flow) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          flow = new LiveObject({ nodes: new LiveMap<string, LiveObject<any>>(), edges: new LiveMap<string, LiveObject<any>>() });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (root as any).set("flow", flow);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let nodesMap: LiveMap<string, LiveObject<any>> = flow.get("nodes");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edgesMap: LiveMap<string, LiveObject<any>> = flow.get("edges");

        if (!nodesMap) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodesMap = new LiveMap<string, LiveObject<any>>();
          flow.set("nodes", nodesMap);
        }
        if (!edgesMap) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          edgesMap = new LiveMap<string, LiveObject<any>>();
          flow.set("edges", edgesMap);
        }

        for (const tc of toolCalls) {
          switch (tc.toolName) {
            case "addNode": {
              const { id, label, shape, colorBg, x, y, width, height } = tc.input;
              const resolvedBg = NODE_COLORS.find((c) => c.bg === colorBg)?.bg ?? "#1F1F1F";
              const resolvedText = colorByBg.get(resolvedBg) ?? "#EDEDED";
              nodesMap.set(
                id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                new LiveObject({
                  id,
                  type: "canvasNode",
                  position: { x, y },
                  data: new LiveObject({
                    label,
                    shape,
                    color: resolvedBg,
                    textColor: resolvedText,
                  }),
                  width: width ?? 160,
                  height: height ?? 60,
                  selected: false,
                  dragging: false,
                  measured: false,
                  resizing: false,
                }) as any,
              );
              break;
            }

            case "moveNode": {
              const { id, x, y } = tc.input;
              const node = nodesMap.get(id);
              if (node) node.set("position", { x, y });
              break;
            }

            case "resizeNode": {
              const { id, width, height } = tc.input;
              const node = nodesMap.get(id);
              if (node) {
                node.set("width", width);
                node.set("height", height);
              }
              break;
            }

            case "updateNodeData": {
              const { id, label, colorBg, shape } = tc.input;
              const node = nodesMap.get(id);
              if (node) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data: LiveObject<any> | undefined = node.get("data");
                if (data) {
                  if (label !== undefined) data.set("label", label);
                  if (colorBg) {
                    const resolvedText = colorByBg.get(colorBg) ?? "#EDEDED";
                    data.set("color", colorBg);
                    data.set("textColor", resolvedText);
                  }
                  if (shape) data.set("shape", shape);
                }
              }
              break;
            }

            case "deleteNode": {
              nodesMap.delete(tc.input.id);
              break;
            }

            case "addEdge": {
              const { id, source, target, label, arrowType } = tc.input;
              edgesMap.set(
                id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                new LiveObject({
                  id,
                  type: "canvasEdge",
                  source,
                  target,
                  data: new LiveObject({
                    label: label ?? "",
                    arrowType: arrowType ?? "source-to-target",
                  }),
                  selected: false,
                }) as any,
              );
              break;
            }

            case "deleteEdge": {
              edgesMap.delete(tc.input.id);
              break;
            }
          }
        }
      });
      } catch (mutateError: unknown) {
        const msg = mutateError instanceof Error ? mutateError.message : String(mutateError);
        console.error("[design-agent] mutateStorage failed:", msg, mutateError);
        throw new Error(`Canvas update failed: ${msg}`);
      }

      setStatus("done", summary);

      await liveblocks.setPresence(roomId, {
        userId: AI_USER_ID,
        data: { cursor: null, thinking: false },
        userInfo: { displayName: "AI Architect", avatarUrl: "", cursorColor: "#f0a030" },
        ttl: 3_000,
      }).catch(() => {});

      await liveblocks.broadcastEvent(roomId, {
        type: "ai-status",
        status: "done",
        message: summary,
      }).catch(() => {});

      const actionsCount = toolCalls.filter((tc) => tc.toolName !== "finishDesign").length;
      return { success: true, summary, actionsCount };
    } catch (error) {
      setStatus("error", "Something went wrong. Please try again.");

      await liveblocks.setPresence(roomId, {
        userId: AI_USER_ID,
        data: { cursor: null, thinking: false },
        ttl: 1_000,
      }).catch(() => {});

      await liveblocks.broadcastEvent(roomId, {
        type: "ai-status",
        status: "error",
        message: "Something went wrong. Please try again.",
      }).catch(() => {});

      throw error;
    }
  },
});

export type { CanvasNode, CanvasEdge };
