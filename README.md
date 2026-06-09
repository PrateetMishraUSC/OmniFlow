<div align="center">

```
███████╗██╗   ██╗███╗   ██╗████████╗██████╗  ██████╗ ██████╗ ██╗   ██╗
██╔════╝╚██╗ ██╔╝████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
███████╗ ╚████╔╝ ██╔██╗ ██║   ██║   ██████╔╝██║   ██║██████╔╝ ╚████╔╝
╚════██║  ╚██╔╝  ██║╚██╗██║   ██║   ██╔══██╗██║   ██║██╔═══╝   ╚██╔╝
███████║   ██║   ██║ ╚████║   ██║   ██║  ██║╚██████╔╝██║        ██║
╚══════╝   ╚═╝   ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝        ╚═╝
```

### AI-Powered Collaborative System Design Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Liveblocks](https://img.shields.io/badge/Liveblocks-Realtime-FF4088?style=for-the-badge)](https://liveblocks.io/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Trigger.dev](https://img.shields.io/badge/Trigger.dev-v4-22C55E?style=for-the-badge)](https://trigger.dev/)

**Design system architectures collaboratively in real time, powered by an AI Architect that generates and modifies diagrams on your canvas.**

[Live Demo](https://syntropy-59hj.vercel.app/sign-in?redirect_url=https%3A%2F%2Fsyntropy-59hj.vercel.app%2F) &middot; [Report Bug](https://github.com/PrateetMishraUSC/Syntropy/issues) &middot; [Request Feature](https://github.com/PrateetMishraUSC/Syntropy/issues)

</div>

---

## Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## About The Project

**Syntropy** is a real-time collaborative platform for designing system architectures. Think of it as a whiteboard-meets-AI-architect: multiple users can simultaneously build, edit, and reason about complex system diagrams while an AI agent assists with layout, component placement, and technical specification generation.

Whether you're sketching a microservices architecture, mapping out a CI/CD pipeline, or designing an event-driven system, Syntropy gives you a canvas with drag-and-drop shapes, real-time collaboration with live cursors, and an AI Architect that can generate entire architectures from a natural language prompt.

### Why Syntropy?

| Problem | Syntropy's Solution |
|---------|-------------------|
| Diagramming tools lack intelligence | AI Architect generates full architectures from text prompts |
| Collaboration is an afterthought | Real-time multiplayer with live cursors, presence indicators, and shared AI chat |
| No bridge from diagram to documentation | One-click spec generation turns your canvas into a technical specification |
| Starting from scratch every time | Pre-built starter templates for common architecture patterns |

---

## Key Features

### Real-Time Collaborative Canvas

- **Live cursors** — see exactly where your teammates are pointing, with name labels and color-coded cursors
- **Shared state** — every node, edge, and label change is synchronized instantly via Liveblocks CRDT storage
- **Presence indicators** — avatar stack in the navbar shows who's currently in the workspace
- **Undo/Redo** — collaborative undo history that respects each user's changes

### AI Architect

- **Natural language to architecture** — describe what you want to build (e.g., *"Design a high-scale e-commerce website with an API gateway, CDNs, Redis Cache, and a NoSQL DB"*) and the AI generates a complete node-and-edge diagram
- **Context-aware** — the AI reads existing canvas state and extends your design without duplicating nodes
- **Real-time status** — all collaborators see the AI's thinking/processing/applying status as it works
- **Collaborative chat** — AI conversation history is shared across all room participants via Liveblocks feeds

### Technical Spec Generation

- **One-click specs** — generate a comprehensive Markdown technical specification from your canvas diagram and AI chat history
- **Structured output** — specs include Overview, Architecture, Components, Data Flow, Integration Points, Non-Functional Requirements, and Open Questions
- **Download & preview** — view specs in a rendered Markdown modal or download as `.md` files
- **Persistent storage** — specs are saved to Vercel Blob and indexed in PostgreSQL

### Rich Diagramming Tools

- **6 shape types** — Rectangle, Circle, Diamond, Pill, Cylinder, Hexagon — each semantically mapped to architecture concepts
- **Drag-and-drop** — drag shapes from the bottom panel onto the canvas with a live ghost preview
- **8 color themes** — semantically organized (blue for APIs, green for databases, purple for queues, etc.)
- **Labeled edges** — click edges to add labels (protocols, actions); choose arrow direction (unidirectional, bidirectional, reversed)
- **Node editing** — double-click any node to edit its label inline
- **Resize & reposition** — drag handles to resize, drag body to move

### Starter Templates

- **Microservices Architecture** — API gateway routing to independent services with separate databases
- **CI/CD Pipeline** — automated build, test, and deployment flow from commit to production
- **Event-Driven System** — producers publishing events to a central bus consumed by independent services

### Project Management

- **Create, rename, delete** projects with URL-safe slugs
- **Share projects** by email — invite collaborators and manage access
- **Copy shareable link** — one-click link sharing
- **Owner/collaborator roles** — project owners can manage the collaborator list

### Authentication & Security

- **Clerk authentication** — sign-up, sign-in, and session management
- **Project-level access control** — only owners and explicitly invited collaborators can access a workspace
- **Access denied screen** — unauthorized users see a clear message instead of broken state

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework with RSC & API routes |
| **Language** | TypeScript 5 | Type-safe development across frontend and backend |
| **UI** | React 19 + Tailwind CSS 4 | Component library with utility-first styling |
| **Canvas** | React Flow (@xyflow/react) | Node-based graph editor with custom nodes and edges |
| **Real-time** | Liveblocks | CRDT-based storage, presence, cursors, and event broadcasting |
| **Authentication** | Clerk | User management, sign-in/sign-up, session handling |
| **Database** | PostgreSQL + Prisma 7 | Relational data with type-safe ORM |
| **AI** | Vercel AI SDK + Google Gemini 2.5 Flash | LLM-powered architecture generation and spec writing |
| **Background Jobs** | Trigger.dev v4 | Durable task execution for AI agent and spec generation |
| **File Storage** | Vercel Blob | Private blob storage for generated spec files |
| **UI Components** | shadcn/ui + Lucide Icons | Accessible, customizable component primitives |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Clerk   │  │  React Flow  │  │Liveblocks│  │ AI Sidebar │  │
│  │  Auth    │  │   Canvas     │  │  Client  │  │   + Chat   │  │
│  └────┬─────┘  └──────┬───────┘  └────┬─────┘  └─────┬──────┘  │
│       │               │               │              │          │
└───────┼───────────────┼───────────────┼──────────────┼──────────┘
        │               │               │              │
        ▼               ▼               ▼              ▼
┌───────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                         │
│                                                               │
│  /api/liveblocks-auth   /api/projects/*   /api/ai/design     │
│                                           /api/ai/spec       │
└──────────┬─────────────────┬──────────────────┬──────────────┘
           │                 │                  │
           ▼                 ▼                  ▼
    ┌──────────┐     ┌──────────────┐   ┌──────────────┐
    │Liveblocks│     │  PostgreSQL  │   │ Trigger.dev  │
    │  Server  │     │   (Prisma)   │   │   Workers    │
    │          │     │              │   │              │
    │ • CRDT   │     │ • Projects   │   │ • Design     │
    │ • Rooms  │     │ • Collabs    │   │   Agent      │
    │ • Events │     │ • Specs      │   │ • Spec Gen   │
    └──────────┘     └──────────────┘   └──────┬───────┘
                                               │
                                               ▼
                              ┌────────────────────────────┐
                              │    Google Gemini 2.5 Flash  │
                              │    (via Vercel AI SDK)      │
                              └────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A [Clerk](https://clerk.com/) account (authentication)
- A [Liveblocks](https://liveblocks.io/) account (real-time collaboration)
- A [PostgreSQL](https://www.postgresql.org/) database (or use Prisma Postgres)
- A [Google AI](https://ai.google.dev/) API key (Gemini model access)
- A [Trigger.dev](https://trigger.dev/) account (background jobs)
- A [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store (spec file storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/PrateetMishraUSC/Syntropy.git
   cd Syntropy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values (see [Environment Variables](#-environment-variables) below).

4. **Generate Prisma client**

   ```bash
   npx prisma generate
   ```

5. **Push database schema** (if using a fresh database)

   ```bash
   npx prisma db push
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Start Trigger.dev dev server** (in a separate terminal)

   ```bash
   npm run dev:trigger
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Clerk sign-in route (e.g., `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk sign-up route (e.g., `/sign-up`) |
| `LIVEBLOCKS_SECRET_KEY` | Liveblocks secret key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key for Gemini |
| `TRIGGER_SECRET_KEY` | Trigger.dev secret key |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |

---

## Usage

### Creating a Project

1. Sign in with your account
2. Click **"Create New Project"** from the sidebar
3. Enter a project name — a URL-safe slug is generated automatically
4. You're dropped into your collaborative canvas workspace

### Designing with AI

1. Click the **Bot icon** in the navbar (or press `Option + S`) to open the AI sidebar
2. Type a prompt like:
   > *"Design a real-time messaging platform with WebSocket servers, message queues, Kafka, and a distributed database."*
3. Watch the AI Architect think, process, and place nodes and edges on your canvas in real time
4. Continue the conversation to refine or extend the architecture

### Using Starter Templates

1. Click **"Templates"** in the navbar
2. Choose from **Microservices Architecture**, **CI/CD Pipeline**, or **Event-Driven System**
3. The template is loaded onto your canvas instantly

### Generating a Technical Spec

1. Open the AI sidebar and switch to the **"Specs"** tab
2. Click **"Generate Spec"**
3. The AI analyzes your canvas nodes, edges, and chat history to produce a comprehensive Markdown specification
4. Preview in the modal or download as a `.md` file

### Collaborating in Real Time

1. Click **"Share"** in the navbar
2. Invite collaborators by email
3. Share the project link — collaborators see live cursors, real-time changes, and shared AI chat

---

## Project Structure

```
Syntropy/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── design/          # AI design agent trigger endpoint
│   │   │   │   ├── route.ts
│   │   │   │   └── token/route.ts
│   │   │   └── spec/            # Spec generation trigger endpoint
│   │   │       ├── route.ts
│   │   │       └── token/route.ts
│   │   ├── liveblocks-auth/     # Liveblocks authentication
│   │   │   └── route.ts
│   │   └── projects/            # Project CRUD + collaborators + specs
│   │       ├── route.ts
│   │       └── [projectId]/
│   │           ├── route.ts
│   │           ├── canvas/route.ts
│   │           ├── collaborators/
│   │           │   ├── route.ts
│   │           │   └── [email]/route.ts
│   │           └── specs/
│   │               ├── route.ts
│   │               └── [specId]/
│   │                   ├── content/route.ts
│   │                   └── download/route.ts
│   ├── editor/
│   │   ├── page.tsx             # Project list / home
│   │   └── [roomId]/page.tsx    # Workspace canvas room
│   ├── sign-in/                 # Clerk sign-in page
│   ├── sign-up/                 # Clerk sign-up page
│   ├── generated/prisma/        # Auto-generated Prisma client
│   ├── globals.css              # Global styles & Tailwind config
│   ├── layout.tsx               # Root layout with Clerk provider
│   └── page.tsx                 # Entry redirect (-> /editor or /sign-in)
│
├── components/
│   ├── editor/
│   │   ├── access-denied.tsx    # Unauthorized access screen
│   │   ├── ai-sidebar.tsx       # AI chat + specs panel
│   │   ├── canvas-flow.tsx      # React Flow canvas with custom nodes/edges
│   │   ├── canvas-room.tsx      # Liveblocks room wrapper for canvas
│   │   ├── editor-client.tsx    # Project list client component
│   │   ├── editor-navbar.tsx    # Top navigation bar
│   │   ├── project-dialogs.tsx  # Create/rename/delete project modals
│   │   ├── project-sidebar.tsx  # Left sidebar with project list
│   │   ├── share-dialog.tsx     # Share & invite collaborators dialog
│   │   ├── shape-panel.tsx      # Drag-and-drop shape toolbar
│   │   ├── shape-renderer.tsx   # SVG shape rendering
│   │   ├── shortcuts-popover.tsx# Keyboard shortcuts reference
│   │   ├── starter-templates-modal.tsx  # Template picker modal
│   │   ├── starter-templates.ts # Pre-built architecture templates
│   │   └── workspace-client.tsx # Main workspace orchestrator
│   └── ui/                      # shadcn/ui primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── scroll-area.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
│
├── hooks/
│   ├── use-canvas-autosave.ts   # Debounced canvas persistence
│   ├── use-keyboard-shortcuts.ts# Global keyboard shortcut handler
│   ├── use-project-actions.ts   # Project CRUD action hooks
│   └── use-project-dialogs.ts   # Dialog state management
│
├── lib/
│   ├── liveblocks.ts            # Liveblocks server client
│   ├── prisma.ts                # Prisma client singleton
│   ├── project-access.ts        # Authorization helpers
│   ├── projects.ts              # Project query functions
│   └── utils.ts                 # Utility functions (cn, etc.)
│
├── trigger/
│   ├── design-agent.ts          # AI design agent (Trigger.dev task)
│   └── generate-spec.ts         # Spec generation (Trigger.dev task)
│
├── types/
│   └── canvas.ts                # Canvas type definitions (shapes, edges, nodes)
│
├── prisma/
│   └── schema.prisma            # Database schema
│
├── public/
│   └── syntropy-logo.png        # Logo asset
│
├── liveblocks.config.ts         # Liveblocks type declarations
├── trigger.config.ts            # Trigger.dev configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.mjs           # PostCSS configuration
├── eslint.config.mjs            # ESLint configuration
├── .gitignore
└── package.json
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/liveblocks-auth` | Authenticate user for Liveblocks room access |
| `GET` | `/api/projects` | List projects for the current user |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/[projectId]` | Get project details |
| `PATCH` | `/api/projects/[projectId]` | Rename a project |
| `DELETE` | `/api/projects/[projectId]` | Delete a project |
| `GET` | `/api/projects/[projectId]/collaborators` | List collaborators |
| `POST` | `/api/projects/[projectId]/collaborators` | Invite a collaborator |
| `DELETE` | `/api/projects/[projectId]/collaborators/[email]` | Remove a collaborator |
| `GET` | `/api/projects/[projectId]/canvas` | Get saved canvas state |
| `PUT` | `/api/projects/[projectId]/canvas` | Save canvas state |
| `GET` | `/api/projects/[projectId]/specs` | List generated specs |
| `GET` | `/api/projects/[projectId]/specs/[specId]/content` | Get spec content |
| `GET` | `/api/projects/[projectId]/specs/[specId]/download` | Download spec file |
| `POST` | `/api/ai/design` | Trigger the AI design agent |
| `POST` | `/api/ai/spec` | Trigger spec generation |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `+` | Zoom in |
| `-` | Zoom out |
| `Cmd + Z` | Undo |
| `Cmd + Shift + Z` | Redo |
| `Option + A` | Toggle project sidebar |
| `Option + S` | Toggle AI sidebar |
| `Shift + Click` | Select multiple nodes |
| `Double-click node` | Edit node label |
| `Click edge` | Edit edge label |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production (runs `prisma generate` first) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run dev:trigger` | Start Trigger.dev dev worker |
| `npm run deploy:trigger` | Deploy Trigger.dev tasks to production |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

**Prateet Mishra** — [@PrateetMishraUSC](https://github.com/PrateetMishraUSC)

Project Link: [https://github.com/PrateetMishraUSC/Syntropy](https://github.com/PrateetMishraUSC/Syntropy)

---

<div align="center">

Built with **Next.js**, **Liveblocks**, **React Flow**, **Trigger.dev**, and **Google Gemini**

</div>
