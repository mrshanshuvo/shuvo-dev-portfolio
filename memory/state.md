# Current Project State

## Project Overview

This project is a modern, dynamic developer portfolio built for showcasing projects, skills, and professional experience. It includes both a public-facing portfolio and an authenticated admin dashboard for managing content dynamically.

## Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI, base-ui, Radix UI primitives
- **Animations:** Framer Motion, tw-animate-css, lenis (smooth scrolling)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** NextAuth.js (v5 beta)
- **State/Data Fetching:** React Query (@tanstack/react-query)
- **Media:** Cloudinary (for image uploads)
- **Package Manager:** pnpm

## Architecture

- `src/app/(public)`: Public-facing portfolio pages.
- `src/app/(admin)`: Protected admin dashboard routes for CMS functionality.
- `src/app/(auth)`: Authentication routes (login).
- `src/app/api`: Next.js API routes (REST/RPC).
- `src/components`: Reusable UI components.

## Active Collections (16)

User, Project, Category, Skill, Technology, Experience, Education, Certification, Demo, Blog, Hero (singleton), About (singleton), Setting (singleton), Message, Visitor, SocialLink.

**Removed:** Testimonial, Service, Workflow, Stat (trimmed for minimal Brittany Chiang aesthetic).

## Public Page Flow

Hero → About → Experience → Projects → Playground → Skills → Education → Certifications → Blog → Contact

## Current Status

- Project is active and under development.
- The admin dashboard features sections for managing hero identity, socials, about, experiences, projects, skills, demos, blogs, certifications, education, messages, and settings.
- Built-in ESLint and TypeScript checking is configured and active.
- Targeting a clean, minimal developer portfolio aesthetic inspired by brittanychiang.com.
- Advanced CMS capabilities implemented (e.g., dynamic SVGs for skills/tech, smart Dark Mode inversion for Social Links).
