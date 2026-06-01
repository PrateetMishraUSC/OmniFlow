import { getProjectsForUser } from "@/lib/projects"
import { EditorClient } from "@/components/editor/editor-client"

export default async function EditorPage() {
  const { owned, shared } = await getProjectsForUser()

  return <EditorClient ownedProjects={owned} sharedProjects={shared} />
}
