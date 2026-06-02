"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  isOpen: boolean
  onToggle: () => void
  title?: string
  actions?: React.ReactNode
  className?: string
}

export function EditorNavbar({ isOpen, onToggle, title, actions, className }: EditorNavbarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 h-12 flex items-center",
        "bg-card border-b border-border",
        className
      )}
    >
      <div className="flex items-center px-2">
        <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Toggle sidebar">
          {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>

      {title && (
        <span className="ml-2 text-sm font-medium text-foreground truncate max-w-xs">
          {title}
        </span>
      )}

      <div className="flex-1" />

      {actions && <div className="flex items-center gap-1 px-2">{actions}</div>}

      <div className="flex items-center px-3">
        <UserButton />
      </div>
    </header>
  )
}
