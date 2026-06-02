import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export type UserIdentity = {
  userId: string;
  email: string | null;
};

export async function getCurrentUserIdentity(): Promise<UserIdentity | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  return { userId, email };
}

export async function getAccessibleProject(
  projectId: string,
  identity: UserIdentity
): Promise<{ id: string; name: string } | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  });
  if (!project) return null;
  if (project.ownerId === identity.userId) {
    return { id: project.id, name: project.name };
  }
  if (!identity.email) return null;
  const collaborator = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email: identity.email } },
    select: { id: true },
  });
  return collaborator ? { id: project.id, name: project.name } : null;
}
