"use client"

import { Pencil, Trash2, X, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { ProjectRef } from "@/lib/projects"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  onOpenCreate: () => void
  onRename: (project: ProjectRef) => void
  onDelete: (project: ProjectRef) => void
  ownedProjects: ProjectRef[]
  sharedProjects: ProjectRef[]
  activeRoomId?: string
  className?: string
  /**
   * "overlay" (default): fixed panel that floats over content.
   * "push": inline panel; parent controls visibility via width transition.
   */
  variant?: "overlay" | "push"
}

function SidebarContent({
  onClose,
  onOpenCreate,
  onRename,
  onDelete,
  ownedProjects,
  sharedProjects,
  activeRoomId,
}: Omit<ProjectSidebarProps, "isOpen" | "className" | "variant">) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border shrink-0">
        <span className="text-sm font-semibold text-copy-primary">Project</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-copy-muted"><i><b>⌥ or ⎇ + A</b></i></span>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close sidebar">
            <X />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-projects" className="flex-1 flex flex-col min-h-0 px-3 pt-3">
        <TabsList className="w-full bg-subtle">
          <TabsTrigger value="my-projects" className="flex-1 text-copy-muted data-active:bg-[rgba(240,160,48,0.12)] data-active:text-[#f0a030]">My Projects</TabsTrigger>
          <TabsTrigger value="shared" className="flex-1 text-copy-muted data-active:bg-[rgba(240,160,48,0.12)] data-active:text-[#f0a030]">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects" className="flex-1 min-h-0">
          {ownedProjects.length === 0 ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <span className="text-sm text-muted-foreground">No projects yet</span>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <ul className="py-1">
                {ownedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onRename={onRename}
                    onDelete={onDelete}
                    showActions
                    isActive={project.id === activeRoomId}
                  />
                ))}
              </ul>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="shared" className="flex-1 min-h-0">
          {sharedProjects.length === 0 ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <span className="text-sm text-muted-foreground">Nothing shared yet</span>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <ul className="py-1">
                {sharedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onRename={onRename}
                    onDelete={onDelete}
                    showActions={false}
                    isActive={project.id === activeRoomId}
                  />
                ))}
              </ul>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      <div className="p-3 border-t border-surface-border shrink-0">
        <Button
          className="w-full gap-2 bg-[#f0a030] hover:bg-[#f0a030]/90 text-base border-0"
          onClick={onOpenCreate}
        >
          <Plus />
          New Project
        </Button>
      </div>
    </>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onOpenCreate,
  onRename,
  onDelete,
  ownedProjects,
  sharedProjects,
  activeRoomId,
  className,
  variant = "overlay",
}: ProjectSidebarProps) {
  if (variant === "push") {
    return (
      <aside
        id="editor-project-sidebar"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn("h-full w-72 flex flex-col bg-base/95 border-r border-surface-border backdrop-blur-sm", className)}
      >
        <SidebarContent
          onClose={onClose}
          onOpenCreate={onOpenCreate}
          onRename={onRename}
          onDelete={onDelete}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeRoomId={activeRoomId}
        />
      </aside>
    )
  }

  return (
    <>
      {/* Mobile backdrop scrim */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-20 bg-black/50 transition-opacity duration-200 sm:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        id="editor-project-sidebar"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed top-12 left-0 bottom-0 z-30 w-72",
          "flex flex-col bg-base/95 border-r border-surface-border backdrop-blur-sm",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none",
          className
        )}
      >
        <SidebarContent
          onClose={onClose}
          onOpenCreate={onOpenCreate}
          onRename={onRename}
          onDelete={onDelete}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeRoomId={activeRoomId}
        />
      </aside>
    </>
  )
}

function ProjectItem({
  project,
  onRename,
  onDelete,
  showActions,
  isActive,
}: {
  project: ProjectRef
  onRename: (project: ProjectRef) => void
  onDelete: (project: ProjectRef) => void
  showActions: boolean
  isActive?: boolean
}) {
  return (
    <li className={cn(
      "group flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors hover:bg-subtle",
      isActive && "bg-[rgba(240,160,48,0.10)] border-l-2 border-[#f0a030] pl-[6px]"
    )}>
      <Link
        href={`/editor/${project.id}`}
        className={cn("flex-1 truncate text-sm", isActive ? "text-[#f0a030]" : "text-copy-primary")}
      >
        {project.name}
      </Link>
      {showActions && (
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Rename ${project.name}`}
            onClick={() => onRename(project)}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${project.name}`}
            onClick={() => onDelete(project)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </li>
  )
}
