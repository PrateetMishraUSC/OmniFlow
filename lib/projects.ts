import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export type ProjectRef = {
  id: string;
  name: string;
};

const select = { id: true, name: true } as const;

export async function getProjectsForUser(): Promise<{
  owned: ProjectRef[];
  shared: ProjectRef[];
}> {
  const { userId } = await auth();
  if (!userId) return { owned: [], shared: [] };

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  const [owned, collaborations] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      select,
    }),
    email
      ? prisma.projectCollaborator.findMany({
          where: { email },
          include: { project: { select } },
          orderBy: { createdAt: "desc" },
        })
      : [],
  ]);

  const shared = collaborations.map((c) => c.project);

  return { owned, shared };
}
