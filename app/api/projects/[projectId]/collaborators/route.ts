import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });

  const isOwner = project.ownerId === userId;
  const client = await clerkClient();

  if (!isOwner) {
    // Verify caller is a collaborator via their primary email
    const callerResult = await client.users.getUserList({ userId: [userId] });
    const callerEmail = callerResult.data[0]?.emailAddresses?.[0]?.emailAddress;
    const collab = callerEmail
      ? await prisma.projectCollaborator.findUnique({
          where: { projectId_email: { projectId, email: callerEmail } },
        })
      : null;
    if (!collab) return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch owner Clerk data
  const ownerResult = await client.users.getUserList({ userId: [project.ownerId] });
  const ownerUser = ownerResult.data[0];
  const owner = {
    name: ownerUser
      ? [ownerUser.firstName, ownerUser.lastName].filter(Boolean).join(" ") || null
      : null,
    imageUrl: ownerUser?.imageUrl ?? null,
    email:
      ownerUser?.emailAddresses?.[0]?.emailAddress ??
      `user-${project.ownerId.slice(0, 6)}`,
  };

  // Fetch collaborators with Clerk enrichment
  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { email: true },
  });

  let collaborators: Array<{ email: string; name: string | null; imageUrl: string | null }> = [];

  if (rows.length > 0) {
    const emails = rows.map((r) => r.email);
    const result = await client.users.getUserList({ emailAddress: emails });
    const byEmail = new Map(
      result.data.flatMap((u) =>
        u.emailAddresses.map((ea) => [
          ea.emailAddress,
          {
            name: [u.firstName, u.lastName].filter(Boolean).join(" ") || null,
            imageUrl: u.imageUrl || null,
          },
        ])
      )
    );
    collaborators = rows.map((r) => ({
      email: r.email,
      name: byEmail.get(r.email)?.name ?? null,
      imageUrl: byEmail.get(r.email)?.imageUrl ?? null,
    }));
  }

  return Response.json({ isOwner, owner, collaborators });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const collaborator = await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    create: { projectId, email },
    update: {},
  });

  return Response.json(collaborator, { status: 201 });
}
