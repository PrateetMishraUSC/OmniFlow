"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export function EditorNavbar({ isOpen, onToggle, className }: EditorNavbarProps) {
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

      <div className="flex-1" />

      <div className="flex items-center px-2" />
    </header>
  )
}
