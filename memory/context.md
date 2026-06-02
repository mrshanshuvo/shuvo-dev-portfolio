# Context & Core Guidelines

## Project Summary

A full-stack Next.js developer portfolio with a custom Content Management System (CMS). The application serves a dual purpose: a visually stunning, highly animated public face to impress visitors, and a functional admin dashboard to manage portfolio content (projects, experiences, skills, socials) without touching code.

## Core Directives

1. **Aesthetics First:** The public UI must be extremely premium and minimal, inspired by brittanychiang.com. Utilize modern web design trends (dark mode, glassmorphism, subtle gradients, and smooth Framer Motion micro-animations) while keeping the layout clean and developer-focused.
2. **Type Safety:** Maintain strict TypeScript typing across all components and API routes.
3. **Admin Usability:** The admin dashboard must be intuitive, robust, and handle data synchronization gracefully via React Query.
4. **Performance:** Ensure optimized image loading (Cloudinary) and efficient font loading (next/font).

## Agent Instructions

- Always update `session-log.md` with significant actions.
- Document architectural choices in `decisions.md`.
- Keep `todos.md` prioritized and updated.
- Reference `docs/architecture.md` for folder structure standards before refactoring.
