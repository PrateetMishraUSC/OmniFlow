import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  const name =
    typeof body.name === "string" && body.name.trim().length > 0
      ? body.name.trim()
      : "Untitled Project";
  const id =
    typeof body.id === "string" && body.id.trim().length > 0
      ? body.id.trim()
      : undefined;

  const project = await prisma.project.create({
    data: { ...(id ? { id } : {}), ownerId: userId, name },
  });

  return Response.json(project, { status: 201 });
}
