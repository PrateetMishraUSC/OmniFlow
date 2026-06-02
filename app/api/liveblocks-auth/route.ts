import { auth, currentUser } from "@clerk/nextjs/server";
import { getLiveblocksClient, getCursorColor } from "@/lib/liveblocks";
import { getCurrentUserIdentity, getAccessibleProject } from "@/lib/project-access";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  // Liveblocks client sends { room: "<roomId>" } in the POST body
  const roomId = typeof body.room === "string" ? body.room : null;
  if (!roomId) {
    return new Response("room is required", { status: 400 });
  }

  const identity = await getCurrentUserIdentity();
  if (!identity) {
    return new Response("Unauthorized", { status: 401 });
  }

  const project = await getAccessibleProject(roomId, identity);
  if (!project) {
    return new Response("Forbidden", { status: 403 });
  }

  const user = await currentUser();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Anonymous";
  const avatarUrl = user?.imageUrl ?? "";
  const cursorColor = getCursorColor(userId);

  const liveblocks = getLiveblocksClient();

  // Ensure the room exists before issuing a token
  await liveblocks.getOrCreateRoom(roomId, { defaultAccesses: [] });

  const session = liveblocks.prepareSession(userId, {
    userInfo: { displayName, avatarUrl, cursorColor },
  });
  session.allow(roomId, session.FULL_ACCESS);

  const { status, body: responseBody } = await session.authorize();
  return new Response(responseBody, { status });
}
