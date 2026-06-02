"use client"

import { useState } from "react"
import { Share2, Bot } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ShareDialog } from "@/components/editor/share-dialog"
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
      <main className="relative mt-12 flex-1 overflow-hidden flex items-center justify-center bg-[#111114]">
          {/* Grid — matches --border-default at low opacity */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(42,42,48,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,48,0.7) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Soft grey radial glow — top center */}
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)" }}
          />
          {/* Subtle elevated radial — bottom right */}
          <div
            className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 65%)" }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-5 text-center px-6 max-w-2xl">
            {/* Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#18181c] border border-[#2a2a30] shadow-lg shadow-black/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-9 w-9 text-[#c0c0cc]"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>

            {/* Label */}
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500">
              Workspace Shell
            </p>

            {/* Heading */}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
              Canvas and collaboration tooling land here next.
            </h1>

            {/* Description */}
            <p className="text-sm leading-relaxed text-zinc-400 max-w-md">
              This room is ready for the shared architecture canvas, durable AI workflows, and
              real-time presence. For now, the shell is wired with project context and navigation
              only.
            </p>
          </div>
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
