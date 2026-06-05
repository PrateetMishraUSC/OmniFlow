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

  const body = await request.json();
  const canvasJson = JSON.stringify(body);

  const blob = await put(`canvas/${projectId}.json`, canvasJson, {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
  });

  await prisma.project.update({
    where: { id: projectId },
    data: { canvasJsonPath: blob.url },
  });

  return Response.json({ url: blob.url });
}
