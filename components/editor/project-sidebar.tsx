"use client"

import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ProjectSidebar({ isOpen, onClose, className }: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed top-12 left-0 bottom-0 z-30 w-72",
        "flex flex-col bg-card border-r border-border",
        "transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-foreground">Project</span>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close sidebar">
          <X />
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="flex-1 flex flex-col min-h-0 px-3 pt-3">
        <TabsList className="w-full">
          <TabsTrigger value="my-projects" className="flex-1">My Projects</TabsTrigger>
          <TabsTrigger value="shared" className="flex-1">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects" className="flex-1 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">No projects yet</span>
        </TabsContent>

        <TabsContent value="shared" className="flex-1 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Nothing shared yet</span>
        </TabsContent>
      </Tabs>

      <div className="p-3 border-t border-border">
        <Button className="w-full gap-2" variant="outline">
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  )
}
