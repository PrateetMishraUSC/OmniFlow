import prisma from "@/lib/prisma";
import { getCurrentUserIdentity, getAccessibleProject } from "@/lib/project-access";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; specId: string }> }
) {
  const identity = await getCurrentUserIdentity();
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, specId } = await params;

  const access = await getAccessibleProject(projectId, identity);
  if (!access) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const spec = await prisma.projectSpec.findUnique({
    where: { id: specId },
    select: { projectId: true, filePath: true },
  });

  if (!spec) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (spec.projectId !== projectId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const res = await fetch(spec.filePath, {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
  });

  if (!res.ok) {
    return Response.json({ error: "Spec file unavailable" }, { status: 502 });
  }

  const content = await res.text();

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="spec-${specId}.md"`,
    },
  });
}
