"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { Button } from "@/components/ui/button"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

  return (
    <div className="h-screen flex flex-col">
      <EditorNavbar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCreate={dialogs.openCreate}
        onRename={dialogs.openRename}
        onDelete={dialogs.openDelete}
      />
      <main className="flex-1 mt-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create a project or add an existing one
          </h1>
          <p className="text-lg text-muted-foreground max-w-m">
            Start a new architecture workspace, or choose a project from the sidebar
          </p>
          <Button onClick={dialogs.openCreate} className="gap-2 mt-1 text-md">
            <Plus />
            New Project
          </Button>
        </div>
      </main>
      <ProjectDialogs
        dialog={dialogs.dialog}
        activeProject={dialogs.activeProject}
        nameInput={dialogs.nameInput}
        setNameInput={dialogs.setNameInput}
        slug={dialogs.slug}
        loading={dialogs.loading}
        close={dialogs.close}
      />
    </div>
  )
}
