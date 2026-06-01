"use client"

import { useState, useCallback } from "react"
import { type Project } from "@/lib/mock-projects"

export type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function useProjectDialogs() {
  const [dialog, setDialog] = useState<DialogType>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [loading, setLoading] = useState(false)

  const slug = toSlug(nameInput)

  const openCreate = useCallback(() => {
    setNameInput("")
    setDialog("create")
  }, [])

  const openRename = useCallback((project: Project) => {
    setActiveProject(project)
    setNameInput(project.name)
    setDialog("rename")
  }, [])

  const openDelete = useCallback((project: Project) => {
    setActiveProject(project)
    setDialog("delete")
  }, [])

  const close = useCallback(() => {
    setDialog(null)
    setActiveProject(null)
    setNameInput("")
    setLoading(false)
  }, [])

  return {
    dialog,
    activeProject,
    nameInput,
    setNameInput,
    slug,
    loading,
    setLoading,
    openCreate,
    openRename,
    openDelete,
    close,
  }
}

export type ProjectDialogsState = ReturnType<typeof useProjectDialogs>
