# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 12: Shape Panel (Bottom) — Complete

## Current Goal

- Define the immediate implementation goal here.

## Completed

- 01-design-system: shadcn/ui installed and configured (Radix + Nova preset, Tailwind v4), components Button/Card/Dialog/Input/Tabs/TextArea/ScrollArea added, lucide-react installed, libs/utils.ts created with cn() helper, dark theme active via .dark class on <html>.
- 02-editor: EditorNavbar (fixed h-12, sidebar toggle with PanelLeftOpen/PanelLeftClose, dark bg, subtle border-b) and ProjectSidebar (fixed floating overlay, slides in from left via translateX transition, Tabs with My Projects/Shared empty states, New Project button) created. Dialog pattern already ready via existing dialog.tsx (Title, Description, Footer actions, uses color tokens).
- 03-auth: ClerkProvider wraps root layout with dark theme + CSS variable overrides; proxy.ts at root with clerkMiddleware protecting all routes except /sign-in and /sign-up; sign-in/sign-up pages with two-panel desktop layout (left: logo + tagline + feature list, right: Clerk form) and form-only on mobile; app/page.tsx redirects authenticated → /editor, unauthenticated → /sign-in; UserButton added to EditorNavbar right section; app/editor/page.tsx created.
- 04-project-dialogs: Editor home screen (heading + description + New Project button) in app/editor/page.tsx; useProjectDialogs hook (dialog/form/loading state, slug derivation) in hooks/use-project-dialogs.ts; Create/Rename/Delete dialogs in components/editor/project-dialogs.tsx; ProjectSidebar updated with project list from mock data, Rename/Delete actions on owned projects (hidden on shared), mobile backdrop scrim; mock projects in lib/mock-projects.ts.
- 05-prisma: Project and ProjectCollaborator models in prisma/models/project.prisma (status enum DRAFT/ARCHIVED, cascade delete, unique/index constraints); lib/prisma.ts cached singleton branching on prisma+postgres:// (Accelerate) vs direct @prisma/adapter-pg; migration applied (20260601082723_init_project_models); client generated to app/generated/prisma/. Workaround: zeptomatch CJS shim patched into @prisma/dev for Node 20 compatibility; prisma.config.ts updated to load .env.local.
- 06-project-apis: REST endpoints in app/api/projects/route.ts (GET list, POST create) and app/api/projects/[projectId]/route.ts (PATCH rename, DELETE delete); Clerk userId used as ownerId; 401 for unauthenticated, 403 for non-owner mutations; default name "Untitled Project". next.config.ts updated with serverExternalPackages for Prisma Accelerate optional deps; lib/prisma.ts uses eval('require') to prevent Turbopack from statically resolving uninstalled Accelerate packages.
- 07-wire-editor: app/editor/page.tsx converted to async server component using getProjectsForUser() (lib/projects.ts) to fetch owned and shared projects server-side; useProjectDialogs replaced by useProjectActions hook (hooks/use-project-actions.ts) with create (slug+6-char suffix roomId, POST, navigate), rename (PATCH, refresh), and delete (DELETE, redirect if active workspace else refresh) mutations; components/editor/editor-client.tsx client wrapper holds sidebar/dialog state; ProjectSidebar updated to accept ownedProjects/sharedProjects props; ProjectDialogs wired to onCreate/onRename/onDelete handlers with loading states; POST /api/projects accepts optional custom id for roomId alignment.
- 08-editor-workspace-shell: app/editor/[roomId]/page.tsx server component with server-side access checks (redirect /sign-in if unauthenticated, AccessDenied for missing/unauthorized projects); lib/project-access.ts with getCurrentUserIdentity() and getAccessibleProject() helpers; components/editor/access-denied.tsx centered lock-icon denial page; components/editor/workspace-client.tsx client wrapper with full-viewport layout (navbar with project name + Share button + AI toggle, ProjectSidebar with active room highlighted, dark canvas placeholder, collapsible AI sidebar placeholder); EditorNavbar extended with optional title and actions props; ProjectSidebar extended with activeRoomId prop for item highlighting; use-project-actions.ts updated to detect roomId param for delete-redirect logic.
- 09-share-dialog: GET/POST /api/projects/[projectId]/collaborators (list enriched with Clerk name+avatar, invite by email with upsert, ownership enforced); DELETE /api/projects/[projectId]/collaborators/[email] (owner-only remove, URL-decoded email); components/editor/share-dialog.tsx self-contained dialog (fetches on open, owner sees invite input + remove buttons, collaborators see read-only list, Clerk name/avatar with initials fallback, copy-link button with 2s "Copied!" feedback); Share button in workspace navbar opens dialog.
- 10-liveblocks-setup: liveblocks.config.ts updated with Presence (cursor x/y + isThinking) and UserMeta (displayName, avatarUrl, cursorColor); lib/liveblocks.ts cached Liveblocks node client singleton + getCursorColor() deterministic palette helper (8 colors, djb2-style hash); POST /api/liveblocks-auth requires Clerk auth, verifies project access via getAccessibleProject(), calls getOrCreateRoom() to ensure room exists, issues session token with FULL_ACCESS and user metadata; @liveblocks/node installed.
- 11-base-canvas-design: types/canvas.ts defines CanvasNodeData (label/color/shape), CanvasNode and CanvasEdge typed; components/editor/canvas-room.tsx wraps LiveblocksProvider (authEndpoint=/api/liveblocks-auth) + RoomProvider (initialPresence cursor:null isThinking:false) + ClientSideSuspense (spinner fallback) + ErrorBoundaryCanvas; components/editor/canvas-flow.tsx uses useLiveblocksFlow({ suspense: true }) with empty initial nodes/edges, renders ReactFlow with ConnectionMode.Loose, fitView, Lines Background (grid-pattern), dark MiniMap; workspace-client.tsx canvas placeholder replaced with CanvasRoom; auth route fixed to read body.room (standard Liveblocks field).
- 12-shape-panel-bottom: CanvasShape union type exported from types/canvas.ts (rectangle/circle/diamond/pill/cylinder/hexagon); components/editor/shape-panel.tsx floating pill toolbar with draggable lucide-react icon buttons, sets application/canvas-shape dataTransfer payload (shape+width+height); canvas-flow.tsx updated with canvasNode custom renderer (simple bordered rect, label or shape name centered), onDrop+onDragOver handlers using onInit instanceRef for screenToFlowPosition coordinate conversion, node IDs as shape-timestamp-counter, adds nodes via onNodesChange add change (Liveblocks-synced), ShapePanel mounted via ReactFlow Panel at bottom-center.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn/ui uses @/lib/utils for generated components (components.json alias). libs/utils.ts is a separate standalone cn() export per spec.
- Dark mode is enabled globally by adding the `dark` class to the <html> element in layout.tsx.

## Session Notes

- Add context needed to resume work in the next session.
