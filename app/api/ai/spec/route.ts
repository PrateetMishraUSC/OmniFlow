import { tasks, auth as triggerAuth } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUserIdentity, getAccessibleProject } from "@/lib/project-access";
import type { generateSpec } from "@/trigger/generate-spec";

const BodySchema = z.object({
  roomId: z.string().min(1),
  chatHistory: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional()
    .default([]),
  nodes: z.array(z.unknown()).optional().default([]),
  edges: z.array(z.unknown()).optional().default([]),
});

export async function POST(request: Request) {
  const identity = await getCurrentUserIdentity();
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const { roomId, chatHistory, nodes, edges } = parsed.data;

  // Derive projectId from roomId — never trust a client-supplied projectId
  const project = await getAccessibleProject(roomId, identity);
  if (!project) {
    return Response.json({ error: "Project not found or access denied" }, { status: 403 });
  }

  const handle = await tasks.trigger<typeof generateSpec>("generate-spec", {
    projectId: project.id,
    roomId,
    chatHistory,
    nodes,
    edges,
  });

  const [publicToken] = await Promise.allSettled([
    triggerAuth.createPublicToken({
      scopes: { read: { runs: [handle.id] } },
      expirationTime: "1h",
    }),
    prisma.taskRun.create({ data: { runId: handle.id, projectId: project.id, userId: identity.userId } }),
  ]).then((results) => results.map((r) => (r.status === "fulfilled" ? r.value : null)));

  return Response.json({ runId: handle.id, publicToken }, { status: 201 });
}
