import { auth } from "@clerk/nextjs/server";
import { tasks, auth as triggerAuth } from "@trigger.dev/sdk/v3";
import prisma from "@/lib/prisma";
import type { designAgent } from "@/trigger/design-agent";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const roomId = typeof body.roomId === "string" ? body.roomId.trim() : "";
  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";

  if (!prompt || !roomId || !projectId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const handle = await tasks.trigger<typeof designAgent>("design-agent", { prompt, roomId, userId });

  // Both are non-fatal — task is already running regardless
  const [publicToken] = await Promise.allSettled([
    triggerAuth.createPublicToken({
      scopes: { read: { runs: [handle.id] } },
      expirationTime: "1h",
    }),
    prisma.taskRun.create({ data: { runId: handle.id, projectId, userId } }),
  ]).then((results) => results.map((r) => (r.status === "fulfilled" ? r.value : null)));

  return Response.json({ runId: handle.id, publicToken }, { status: 201 });
}
