"use client"

import { useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type ProjectDialogsState } from "@/hooks/use-project-dialogs"

type Props = Pick<
  ProjectDialogsState,
  | "dialog"
  | "activeProject"
  | "nameInput"
  | "setNameInput"
  | "slug"
  | "loading"
  | "close"
>

export function ProjectDialogs({
  dialog,
  activeProject,
  nameInput,
  setNameInput,
  slug,
  loading,
  close,
}: Props) {
  return (
    <>
      <CreateProjectDialog
        open={dialog === "create"}
        nameInput={nameInput}
        setNameInput={setNameInput}
        slug={slug}
        loading={loading}
        onClose={close}
      />
      <RenameProjectDialog
        open={dialog === "rename"}
        activeProject={activeProject}
        nameInput={nameInput}
        setNameInput={setNameInput}
        loading={loading}
        onClose={close}
      />
      <DeleteProjectDialog
        open={dialog === "delete"}
        activeProject={activeProject}
        loading={loading}
        onClose={close}
      />
    </>
  )
}

function CreateProjectDialog({
  open,
  nameInput,
  setNameInput,
  slug,
  loading,
  onClose,
}: {
  open: boolean
  nameInput: string
  setNameInput: (v: string) => void
  slug: string
  loading: boolean
  onClose: () => void
}) {
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
          />
          <p className="text-xs text-muted-foreground">
            {" "}
            <span className="font-mono text-foreground">
              {slug || <span className="text-muted-foreground"></span>}
            </span>
          </p>
        </div>

        <DialogFooter showCloseButton>
          <Button disabled={!nameInput.trim() || loading} onClick={onClose}>
            Create Project
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
}: {
  open: boolean
  activeProject: { name: string } | null
  nameInput: string
  setNameInput: (v: string) => void
  loading: boolean
  onClose: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(frame)
    }
  }, [open])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && nameInput.trim()) onClose()
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
            onClick={onClose}
          >
            Rename
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
}: {
  open: boolean
  activeProject: { name: string } | null
  loading: boolean
  onClose: () => void
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
          <Button variant="destructive" disabled={loading} onClick={onClose}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
