"use client"

import { useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DialogType, ProjectRef } from "@/hooks/use-project-actions"

interface Props {
  dialog: DialogType
  activeProject: ProjectRef | null
  nameInput: string
  setNameInput: (v: string) => void
  slugPreview: string
  loading: boolean
  onClose: () => void
  onCreate: () => void
  onRename: () => void
  onDelete: () => void
}

export function ProjectDialogs({
  dialog,
  activeProject,
  nameInput,
  setNameInput,
  slugPreview,
  loading,
  onClose,
  onCreate,
  onRename,
  onDelete,
}: Props) {
  return (
    <>
      <CreateProjectDialog
        open={dialog === "create"}
        nameInput={nameInput}
        setNameInput={setNameInput}
        slugPreview={slugPreview}
        loading={loading}
        onClose={onClose}
        onCreate={onCreate}
      />
      <RenameProjectDialog
        open={dialog === "rename"}
        activeProject={activeProject}
        nameInput={nameInput}
        setNameInput={setNameInput}
        loading={loading}
        onClose={onClose}
        onRename={onRename}
      />
      <DeleteProjectDialog
        open={dialog === "delete"}
        activeProject={activeProject}
        loading={loading}
        onClose={onClose}
        onDelete={onDelete}
      />
    </>
  )
}

function CreateProjectDialog({
  open,
  nameInput,
  setNameInput,
  slugPreview,
  loading,
  onClose,
  onCreate,
}: {
  open: boolean
  nameInput: string
  setNameInput: (v: string) => void
  slugPreview: string
  loading: boolean
  onClose: () => void
  onCreate: () => void
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && nameInput.trim() && !loading) onCreate()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            autoFocus
            placeholder="Project name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <p className="text-xs text-muted-foreground">
            Room ID:{" "}
            <span className="font-mono" style={{ color: '#56D1E3' }}>
              {slugPreview || <span className="text-muted-foreground italic">derived from name</span>}
            </span>
          </p>
        </div>

        <DialogFooter showCloseButton>
          <Button
            disabled={!nameInput.trim() || loading}
            onClick={onCreate}
            className="border-0"
            style={{
              background: 'linear-gradient(135deg, #4394BF 0%, #56D1E3 55%, #1DE0E7 100%)',
              color: '#ffffff',
            }}
          >
            {loading ? "Creating…" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RenameProjectDialog({
  open,
  activeProject,
  nameInput,
  setNameInput,
  loading,
  onClose,
  onRename,
}: {
  open: boolean
  activeProject: ProjectRef | null
  nameInput: string
  setNameInput: (v: string) => void
  loading: boolean
  onClose: () => void
  onRename: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(frame)
    }
  }, [open])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && nameInput.trim() && !loading) onRename()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription>
            Renaming &ldquo;{activeProject?.name}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <Input
          ref={inputRef}
          placeholder="New project name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <DialogFooter showCloseButton>
          <Button
            disabled={!nameInput.trim() || loading}
            onClick={onRename}
            className="border-0"
            style={{
              background: 'linear-gradient(135deg, #4394BF 0%, #56D1E3 55%, #1DE0E7 100%)',
              color: '#ffffff',
            }}
          >
            {loading ? "Renaming…" : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteProjectDialog({
  open,
  activeProject,
  loading,
  onClose,
  onDelete,
}: {
  open: boolean
  activeProject: ProjectRef | null
  loading: boolean
  onClose: () => void
  onDelete: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{activeProject?.name}&rdquo;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter showCloseButton>
          <Button variant="destructive" disabled={loading} onClick={onDelete}>
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
