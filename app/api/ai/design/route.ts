import { tasks, auth as triggerAuth } from "@trigger.dev/sdk";
import { getCurrentUserIdentity, getAccessibleProject } from "@/lib/project-access";
import prisma from "@/lib/prisma";
import type { designAgent } from "@/trigger/design-agent";

export async function POST(request: Request) {
  const identity = await getCurrentUserIdentity();
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const roomId = typeof body.roomId === "string" ? body.roomId.trim() : "";
  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";

  if (!prompt || !roomId || !projectId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const access = await getAccessibleProject(projectId, identity);
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let handle: Awaited<ReturnType<typeof tasks.trigger>>;
  try {
    handle = await tasks.trigger<typeof designAgent>("design-agent", {
      prompt,
      roomId,
      userId: identity.userId,
    });
  } catch (err) {
    console.error("[/api/ai/design] tasks.trigger failed:", err);
    return Response.json({ error: "Failed to trigger AI task" }, { status: 500 });
  }

  // Both are non-fatal — task is already running regardless
  const [publicToken] = await Promise.allSettled([
    triggerAuth.createPublicToken({
      scopes: { read: { runs: [handle.id] } },
      expirationTime: "1h",
    }),
    prisma.taskRun.create({ data: { runId: handle.id, projectId, userId: identity.userId } }),
  ]).then((results) => results.map((r) => (r.status === "fulfilled" ? r.value : null)));

  return Response.json({ runId: handle.id, publicToken }, { status: 201 });
}
