# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 05: Prisma — Complete

## Current Goal

- Define the immediate implementation goal here.

## Completed

- 01-design-system: shadcn/ui installed and configured (Radix + Nova preset, Tailwind v4), components Button/Card/Dialog/Input/Tabs/TextArea/ScrollArea added, lucide-react installed, libs/utils.ts created with cn() helper, dark theme active via .dark class on <html>.
- 02-editor: EditorNavbar (fixed h-12, sidebar toggle with PanelLeftOpen/PanelLeftClose, dark bg, subtle border-b) and ProjectSidebar (fixed floating overlay, slides in from left via translateX transition, Tabs with My Projects/Shared empty states, New Project button) created. Dialog pattern already ready via existing dialog.tsx (Title, Description, Footer actions, uses color tokens).
- 03-auth: ClerkProvider wraps root layout with dark theme + CSS variable overrides; proxy.ts at root with clerkMiddleware protecting all routes except /sign-in and /sign-up; sign-in/sign-up pages with two-panel desktop layout (left: logo + tagline + feature list, right: Clerk form) and form-only on mobile; app/page.tsx redirects authenticated → /editor, unauthenticated → /sign-in; UserButton added to EditorNavbar right section; app/editor/page.tsx created.
- 04-project-dialogs: Editor home screen (heading + description + New Project button) in app/editor/page.tsx; useProjectDialogs hook (dialog/form/loading state, slug derivation) in hooks/use-project-dialogs.ts; Create/Rename/Delete dialogs in components/editor/project-dialogs.tsx; ProjectSidebar updated with project list from mock data, Rename/Delete actions on owned projects (hidden on shared), mobile backdrop scrim; mock projects in lib/mock-projects.ts.
- 05-prisma: Project and ProjectCollaborator models in prisma/models/project.prisma (status enum DRAFT/ARCHIVED, cascade delete, unique/index constraints); lib/prisma.ts cached singleton branching on prisma+postgres:// (Accelerate) vs direct @prisma/adapter-pg; migration applied (20260601082723_init_project_models); client generated to app/generated/prisma/. Workaround: zeptomatch CJS shim patched into @prisma/dev for Node 20 compatibility; prisma.config.ts updated to load .env.local.

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
