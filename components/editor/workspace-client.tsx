"use client"

import { useState } from "react"
import { Share2, Bot } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ShareDialog } from "@/components/editor/share-dialog"
import { CanvasRoom } from "@/components/editor/canvas-room"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectRef } from "@/lib/projects"

interface WorkspaceClientProps {
  projectName: string
  roomId: string
  ownedProjects: ProjectRef[]
  sharedProjects: ProjectRef[]
}

export function WorkspaceClient({
  projectName,
  roomId,
  ownedProjects,
  sharedProjects,
}: WorkspaceClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const actions = useProjectActions()

  const navActions = (
    <>
      <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => setShareOpen(true)}>
        <Share2 className="h-3.5 w-3.5" />
        Share
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setAiOpen((v) => !v)}
        aria-label="Toggle AI sidebar"
        aria-expanded={aiOpen}
      >
        <Bot className="h-4 w-4" />
      </Button>
    </>
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorNavbar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        title={projectName}
        actions={navActions}
      />

      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCreate={actions.openCreate}
        onRename={actions.openRename}
        onDelete={actions.openDelete}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeRoomId={roomId}
      />

      {/* Canvas — full remaining viewport, sidebars float over it */}
      <main className="relative mt-12 flex-1 overflow-hidden bg-[#111114]">
        <CanvasRoom roomId={roomId} />
      </main>

      {/* AI sidebar — floats over canvas from the right */}
      <aside
        aria-label="AI chat"
        aria-hidden={!aiOpen}
        inert={!aiOpen}
        className={cn(
          "fixed top-12 right-0 bottom-0 z-30 w-80",
          "flex flex-col bg-card border-l border-border",
          "transition-transform duration-200 ease-in-out",
          aiOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center px-4 py-3 border-b border-border shrink-0">
          <span className="text-sm font-medium">AI Assistant</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">AI chat coming soon</p>
        </div>
      </aside>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        roomId={roomId}
        projectName={projectName}
      />

      <ProjectDialogs
        dialog={actions.dialog}
        activeProject={actions.activeProject}
        nameInput={actions.nameInput}
        setNameInput={actions.setNameInput}
        slugPreview={actions.slugPreview}
        loading={actions.loading}
        onClose={actions.close}
        onCreate={actions.createProject}
        onRename={actions.renameProject}
        onDelete={actions.deleteProject}
      />
    </div>
  )
}
