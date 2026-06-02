import Link from "next/link"
import { Lock } from "lucide-react"

export function AccessDenied() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Access denied</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            This project doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
        </div>
        <Link
          href="/editor"
          className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          Back to projects
        </Link>
      </div>
    </div>
  )
}
