import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { getCurrentUserIdentity, getAccessibleProject } from "@/lib/project-access";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentUserIdentity();
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await getAccessibleProject(projectId, identity);
  if (!access) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { canvasJsonPath: true },
  });

  if (!project?.canvasJsonPath) {
    return Response.json({ nodes: [], edges: [] });
  }

  const res = await fetch(project.canvasJsonPath, {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
  });
  if (!res.ok) {
    return Response.json({ nodes: [], edges: [] });
  }

  const canvas = await res.json();
  return Response.json(canvas);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentUserIdentity();
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await getAccessibleProject(projectId, identity);
  if (!access) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !Array.isArray((body as Record<string, unknown>).nodes) ||
    !Array.isArray((body as Record<string, unknown>).edges)
  ) {
    return Response.json(
      { error: "Body must contain nodes and edges arrays" },
      { status: 400 }
    );
  }

  try {
    const blob = await put(`canvas/${projectId}.json`, JSON.stringify(body), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { canvasJsonPath: blob.url },
    });

    return Response.json({ url: blob.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
