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

  const specs = await prisma.projectSpec.findMany({
    where: { projectId },
    select: { id: true, filePath: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ specs });
}
