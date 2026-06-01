---
name: feedback_font_tokens
description: Geist Sans and Mono are the only fonts; always use font-sans / font-mono utilities, never hardcode font families
metadata:
  type: feedback
---

Always use `font-sans` for body/UI text and `font-mono` for code/mono text. Do not use any other font-family or hardcode font names.

**Why:** In globals.css `@theme inline`, `--font-sans` is mapped to `var(--font-geist-sans)` and `--font-mono` to `var(--font-geist-mono)`. These are loaded via Next.js `next/font/google` and injected as CSS variables on `<html>`. A prior bug had `--font-sans: var(--font-sans)` (circular self-reference in Tailwind v4 `@theme inline`), which caused the utility to fall back to the system font. Fixed to `--font-sans: var(--font-geist-sans)`.

**How to apply:** In any new component or page: use `font-sans` for normal text (already the default via `@layer base html { @apply font-sans }`) and `font-mono` for any monospace/code spans. Never add `font-family` CSS directly or import additional fonts.
