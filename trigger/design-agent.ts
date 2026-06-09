import { task, metadata, retry } from "@trigger.dev/sdk";
import { generateText, tool, stepCountIs } from "ai";
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

## Your process (follow this exact order)

STEP 0 — PLAN. Before any tool call, write out your plan as plain text:
  Nodes: list every node id.
  Edges: list every edge as "source -> target : label".
A diagram with N nodes needs AT LEAST N-1 edges, and usually more. Do not under-connect.

STEP 1 — Call addNode once for EVERY node in your plan. Skip none.
STEP 2 — Call addEdge once for EVERY edge in your plan. Work straight down the
  edge list you wrote in STEP 0. Do not stop until every edge is placed.
STEP 3 — Call finishDesign. ONLY after the last edge is placed. Calling it before
  all planned edges exist is an error.

After each tool call you will receive a confirmation. Use it to track progress and
keep going until every node and every edge from your plan has been created.

## Node shapes
- rectangle: services, servers, application layers (generic)
- circle: users, clients, external actors
- diamond: routing, load balancers, decision points
- pill: APIs, endpoints, interfaces, proxies
- cylinder: databases, caches, message queues, storage
- hexagon: microservices, containers, isolated modules

## Node bg colors (use exactly these hex values, passed as colorBg)
- "#10233D" (blue) — APIs, web services, application layers
- "#0F2E18" (green) — databases, persistent storage
- "#2E1938" (purple) — async queues, event buses, pub/sub
- "#331B00" (orange) — gateways, load balancers, proxies
- "#062822" (teal) — caches, CDNs, read replicas
- "#3C1618" (red) — security, auth, rate limiters
- "#3A1726" (pink) — monitoring, logging, analytics
- "#1F1F1F" (dark) — utility services, background workers

## Layout
- First node at x=100, y=150
- Space nodes 280px horizontally, 220px vertically
- Flow left-to-right or top-to-bottom; cluster related services spatially
- Default width=160, height=60; use width=180 for labels longer than 20 chars

## Edge rules
- Every node MUST appear in at least one edge — no isolated nodes
- arrowType "source-to-target" for unidirectional calls, "bidirectional" for mutual
- Short edge labels for protocol or action (e.g. "HTTPS", "SQL", "publish")

## IDs
kebab-case slugs for nodes ("api-gateway", "redis-cache") and edges ("edge-lb-api").

## WORKED EXAMPLE — match this structure exactly

Plan:
  Nodes: user, load-balancer, api-servers, redis-cache, nosql-db, analytics-service
  Edges:
    user -> load-balancer : HTTPS
    load-balancer -> api-servers : route
    api-servers -> redis-cache : cache lookup
    api-servers -> nosql-db : read/write
    api-servers -> analytics-service : log click

Then the calls:
addNode({ id: "user", label: "User", shape: "circle", colorBg: "#1F1F1F", x: 100, y: 150, width: 160, height: 60 })
addNode({ id: "load-balancer", label: "Load Balancer", shape: "diamond", colorBg: "#331B00", x: 380, y: 150, width: 160, height: 60 })
addNode({ id: "api-servers", label: "API Servers", shape: "rectangle", colorBg: "#10233D", x: 660, y: 150, width: 160, height: 60 })
addNode({ id: "redis-cache", label: "Redis Cache", shape: "cylinder", colorBg: "#062822", x: 940, y: 30, width: 160, height: 60 })
addNode({ id: "nosql-db", label: "NoSQL Database", shape: "cylinder", colorBg: "#0F2E18", x: 940, y: 250, width: 160, height: 60 })
addNode({ id: "analytics-service", label: "Analytics Service", shape: "rectangle", colorBg: "#3A1726", x: 660, y: 480, width: 180, height: 60 })
addEdge({ id: "edge-user-lb", source: "user", target: "load-balancer", arrowType: "source-to-target", label: "HTTPS" })
addEdge({ id: "edge-lb-api", source: "load-balancer", target: "api-servers", arrowType: "source-to-target", label: "route" })
addEdge({ id: "edge-api-redis", source: "api-servers", target: "redis-cache", arrowType: "bidirectional", label: "cache lookup" })
addEdge({ id: "edge-api-db", source: "api-servers", target: "nosql-db", arrowType: "bidirectional", label: "read/write" })
addEdge({ id: "edge-api-analytics", source: "api-servers", target: "analytics-service", arrowType: "source-to-target", label: "log click" })
finishDesign({ summary: "URL shortener with load balancer, API servers, Redis cache, NoSQL store, and analytics." })`;

// Tools include execute() so the AI SDK feeds tool results back to the model,
// enabling the multi-step loop to continue past the first batch of calls.
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
    execute: async ({ id }) => `Node "${id}" added. Continue with remaining nodes, then edges.`,
  }),
  moveNode: tool({
    description: "Move an existing node to a new position",
    inputSchema: z.object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
    }),
    execute: async ({ id }) => `Node "${id}" moved.`,
  }),
  resizeNode: tool({
    description: "Resize an existing node",
    inputSchema: z.object({
      id: z.string(),
      width: z.number(),
      height: z.number(),
    }),
    execute: async ({ id }) => `Node "${id}" resized.`,
  }),
  updateNodeData: tool({
    description: "Update the label, color, or shape of an existing node",
    inputSchema: z.object({
      id: z.string(),
      label: z.string().optional(),
      colorBg: z.string().optional(),
      shape: z.enum(CANVAS_SHAPES).optional(),
    }),
    execute: async ({ id }) => `Node "${id}" updated.`,
  }),
  deleteNode: tool({
    description: "Delete a node from the canvas",
    inputSchema: z.object({ id: z.string() }),
    execute: async ({ id }) => `Node "${id}" deleted.`,
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
    execute: async ({ id, source, target }) =>
      `Edge "${id}" added (${source} -> ${target}). Add remaining edges, then call finishDesign.`,
  }),
  deleteEdge: tool({
    description: "Delete an edge from the canvas",
    inputSchema: z.object({ id: z.string() }),
    execute: async ({ id }) => `Edge "${id}" deleted.`,
  }),
  finishDesign: tool({
    description: "Call this last to signal the design is complete",
    inputSchema: z.object({
      summary: z.string().describe("One sentence describing what was designed"),
    }),
    execute: async ({ summary }) => `FINISHED: ${summary}`,
  }),
};

// Narrowed toolset for the repair pass — only edges, so the model cannot add nodes.
const edgeRepairTools = {
  addEdge: canvasTools.addEdge,
};

function setStatus(status: string, message: string) {
  metadata.set("status", status);
  metadata.set("message", message);
}

export const designAgent = task({
  id: "design-agent",
  retry: {
    maxAttempts: 5,
    minTimeoutInMs: 10_000,
    maxTimeoutInMs: 60_000,
    factor: 2,
    randomize: true,
  },
  run: async (payload: { prompt: string; roomId: string; userId?: string }, { ctx }) => {
    const { prompt, roomId } = payload;
    const runId = ctx.run.id;
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
      runId,
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
        runId,
        status: "processing",
        message: "Designing your architecture…",
      }).catch(() => {});

      const contextLine =
        existingNodes.length > 0
          ? `Existing canvas has ${existingNodes.length} nodes: ${JSON.stringify(existingNodes)} and ${existingEdges.length} edges: ${JSON.stringify(existingEdges)}. Extend this design without duplicating existing IDs.`
          : "The canvas is currently empty. Generate a complete initial architecture.";

      // Multi-step execution: stopWhen lets the SDK loop the model across many steps
      // (place nodes, then edges, then finish) instead of stopping after one pass.
      // retry.onThrow catches transient Gemini overload errors before failing the task.
      const result = await retry.onThrow(
        () => generateText({
          model: google("gemini-2.5-flash"),
          tools: canvasTools,
          system: SYSTEM_PROMPT,
          prompt: `${contextLine}\n\nUser request: ${prompt}`,
          maxOutputTokens: 16000,
          temperature: 0.2,
          stopWhen: stepCountIs(24),
        }),
        { maxAttempts: 3, minTimeoutInMs: 8_000, factor: 2 },
      );

      // Collect tool calls across ALL steps, not just the first.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type AnyToolCall = { toolName: string; input: any };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let toolCalls: AnyToolCall[] = result.steps.flatMap((s) => s.toolCalls as AnyToolCall[]);

      // Validation + repair pass: if the model under-connected, run a focused second
      // call that only adds missing edges given the node list.
      const nodeCalls = toolCalls.filter((tc) => tc.toolName === "addNode");
      let edgeCalls = toolCalls.filter((tc) => tc.toolName === "addEdge");

      if (nodeCalls.length > 1 && edgeCalls.length < nodeCalls.length - 1) {
        const usedEdgeIds = new Set(edgeCalls.map((e) => e.input.id as string));
        const nodeList = nodeCalls
          .map((n) => `${n.input.id as string} (${n.input.label as string})`)
          .join(", ");
        const existingEdgeList =
          edgeCalls.map((e) => `${e.input.source as string} -> ${e.input.target as string}`).join("; ") || "none";

        const repair = await retry.onThrow(
          () => generateText({
            model: google("gemini-2.5-flash"),
            tools: edgeRepairTools,
            system:
              "You connect architecture nodes with directed edges. Call addEdge for every " +
              "pair of nodes that communicate so that NO node is isolated. Do not add nodes. " +
              "Use unique kebab-case edge IDs. Add short protocol/action labels.",
            prompt:
              `Nodes: ${nodeList}\n` +
              `Edges already present: ${existingEdgeList}\n\n` +
              `Add all missing edges so every node has at least one connection.`,
            maxOutputTokens: 8000,
            temperature: 0.2,
            stopWhen: stepCountIs(12),
          }),
          { maxAttempts: 3, minTimeoutInMs: 8_000, factor: 2 },
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const repairEdges: AnyToolCall[] = (repair.steps.flatMap((s) => s.toolCalls) as AnyToolCall[])
          .filter((tc) => tc.toolName === "addEdge" && !usedEdgeIds.has(tc.input.id as string));

        edgeCalls = [...edgeCalls, ...repairEdges];
        toolCalls = [...toolCalls, ...repairEdges];
      }

      const finishCall = toolCalls.find((tc) => tc.toolName === "finishDesign");
      const summary = finishCall ? (finishCall.input.summary as string) : "Design complete.";

      const addedNodes = nodeCalls.length;
      const addedEdges = edgeCalls.length;
      const applyingMsg = `Placing ${addedNodes} nodes and ${addedEdges} connections…`;

      setStatus("applying", applyingMsg);
      await liveblocks.broadcastEvent(roomId, {
        type: "ai-status",
        runId,
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
        runId,
        status: "done",
        message: summary,
      }).catch(() => {});

      const actionsCount = toolCalls.filter((tc) => tc.toolName !== "finishDesign").length;
      return { success: true, summary, actionsCount, nodes: addedNodes, edges: addedEdges };
    } catch (error) {
      setStatus("error", "Something went wrong. Please try again.");

      await liveblocks.setPresence(roomId, {
        userId: AI_USER_ID,
        data: { cursor: null, thinking: false },
        ttl: 1_000,
      }).catch(() => {});

      await liveblocks.broadcastEvent(roomId, {
        type: "ai-status",
        runId,
        status: "error",
        message: "Something went wrong. Please try again.",
      }).catch(() => {});

      throw error;
    }
  },
});

export type { CanvasNode, CanvasEdge };
