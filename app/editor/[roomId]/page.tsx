import { redirect } from "next/navigation"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceClient } from "@/components/editor/workspace-client"
import { getCurrentUserIdentity, getAccessibleProject } from "@/lib/project-access"
import { getProjectsForUser } from "@/lib/projects"

export default async function EditorRoomPage(props: PageProps<"/editor/[roomId]">) {
  const { roomId } = await props.params

  const identity = await getCurrentUserIdentity()
  if (!identity) redirect("/sign-in")

  const project = await getAccessibleProject(roomId, identity)
  if (!project) return <AccessDenied />

  const { owned, shared } = await getProjectsForUser()

  return (
    <WorkspaceClient
      projectName={project.name}
      roomId={roomId}
      ownedProjects={owned}
      sharedProjects={shared}
    />
  )
}
