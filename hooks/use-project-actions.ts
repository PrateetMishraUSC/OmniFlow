"use client"

import { useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import type { ProjectRef } from "@/lib/projects"

export type { ProjectRef }
export type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function generateRoomId(name: string): string {
  const slug = toSlug(name)
  const suffix = Math.random().toString(36).slice(2, 8)
  return slug ? `${slug}-${suffix}` : suffix
}

export function useProjectActions() {
  const router = useRouter()
  const params = useParams()
  const activeWorkspaceId =
    params && typeof params.roomId === "string" ? params.roomId :
    params && typeof params.id === "string" ? params.id : null

  const [dialog, setDialog] = useState<DialogType>(null)
  const [activeProject, setActiveProject] = useState<ProjectRef | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [loading, setLoading] = useState(false)

  const slugPreview = toSlug(nameInput)

  const openCreate = useCallback(() => {
    setNameInput("")
    setDialog("create")
  }, [])

  const openRename = useCallback((project: ProjectRef) => {
    setActiveProject(project)
    setNameInput(project.name)
    setDialog("rename")
  }, [])

  const openDelete = useCallback((project: ProjectRef) => {
    setActiveProject(project)
    setDialog("delete")
  }, [])

  const close = useCallback(() => {
    setDialog(null)
    setActiveProject(null)
    setNameInput("")
    setLoading(false)
  }, [])

  const createProject = useCallback(async () => {
    if (!nameInput.trim()) return
    setLoading(true)
    try {
      const roomId = generateRoomId(nameInput.trim())
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim(), id: roomId }),
      })
      if (!res.ok) throw new Error("Failed to create project")
      const project = await res.json()
      close()
      router.push(`/editor/${project.id}`)
    } catch {
      setLoading(false)
    }
  }, [nameInput, close, router])

  const renameProject = useCallback(async () => {
    if (!activeProject || !nameInput.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim() }),
      })
      if (!res.ok) throw new Error("Failed to rename project")
      close()
      router.refresh()
    } catch {
      setLoading(false)
    }
  }, [activeProject, nameInput, close, router])

  const deleteProject = useCallback(async () => {
    if (!activeProject) return
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete project")
      close()
      if (activeProject.id === activeWorkspaceId) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch {
      setLoading(false)
    }
  }, [activeProject, activeWorkspaceId, close, router])

  return {
    dialog,
    activeProject,
    nameInput,
    setNameInput,
    slugPreview,
    loading,
    openCreate,
    openRename,
    openDelete,
    close,
    createProject,
    renameProject,
    deleteProject,
  }
}

export type ProjectActionsState = ReturnType<typeof useProjectActions>
