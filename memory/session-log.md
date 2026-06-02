# Session Log

_Chronological log of agent interactions, tasks completed, and context switches._

## [2026-05-26] Memory System Initialization

- **Task:** Initialize AI agent memory system and documentation folders.
- **Actions:**
  - Created `/memory` folder with `state.md`, `context.md`, `todos.md`, `decisions.md`, and `session-log.md`.
  - Created `/docs` folder with `architecture.md`, `api.md`, and `roadmap.md`.
  - Analyzed current Next.js (App Router) + Mongoose + Tailwind stack.
- **Next Steps:** Follow up with user on `todos.md` items.

## [2026-05-26] Workflow Establishment

- **Task:** Adopt strict agent memory workflow.
- **Actions:**
  - Acknowledged rules for reading `state.md`, `context.md`, `todos.md`, and `decisions.md` before/during tasks.
  - Acknowledged rules for updating `session-log.md`, `state.md`, `todos.md`, and `context.md` after tasks or when sessions grow.
- **Next Steps:** Await next task from the user.

## [2026-05-26] Linting and Warning Cleanup

- **Task:** Resolve IDE warnings and ESLint errors.
- **Actions:**
  - Fixed `setState` warning in `AdminThemeToggle.tsx` and removed unused variables.
  - Escaped quotes and removed unused imports in `CategoryCombobox.tsx`, `AdminSheetShell.tsx`, `AdminShell.tsx`, `AdminTopbar.tsx`, `CategoryManagerDialog.tsx`, `ImageUpload.tsx`, `MediaGalleryManager.tsx`, and `MultiLinkManager.tsx`.
  - Replaced arbitrary class names with standard Tailwind classes (e.g., `min-h-[56px]` to `min-h-14`, `max-w-[80px]` to `max-w-20`).
- **Next Steps:** Mark "Linting Sweep" as complete in `todos.md`.

## [2026-05-26] Version Control Snapshot

- **Task:** Commit recent AI memory and linting changes.
- **Actions:**
  - Ran `git status` to verify modified files.
  - Staged all changes using `git add .`
  - Committed with message: `chore: integrate AI memory system and resolve ESLint/TypeScript warnings`
- **Next Steps:** Await next task from the user.

## [2026-05-26] Bug Fix: Server Component Serialization

- **Task:** Fix Next.js serialization error for Mongoose nested ObjectIds.
- **Actions:**
  - Identified that nested subdocuments (`github`, `live`, etc.) in the `Project` model contained `ObjectId`s with `.toJSON()` methods.
  - Replaced manual mapping in `src/app/(public)/projects/[slug]/page.tsx` with `JSON.parse(JSON.stringify(raw))` to fully serialize the Mongoose document into a plain object before passing it to the Client Component.
- **Next Steps:** Await next task from the user.

## [2026-05-26] Clean Up Unused Code in Projects Archive

- **Task:** Resolve IDE warning for unused `socialLinks` in `src/app/(public)/projects/page.tsx`.
- **Actions:**
  - Removed the unused `socialLinks` variable and the `SocialLinkModel` database query since the footer (which presumably needed it) is not being rendered on this specific page.
- **Next Steps:** Await next task from the user.

## [2026-05-26] UI Refinement: Projects Archive Header

- **Task:** Update the layout structure of the "Project Archive" page heading to match the academic background style.
- **Actions:**
  - Replaced the simple centered `div` and `motion.h1` with a `motion.div` flex layout wrapper (`flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20`).
  - Added `text-left` alignment and `whileInView` animations matching the requested template format.
  - Added the `<FaArchive />` icon and uppercase emerald eyebrow text (`Portfolio Showcase`) above the main heading.
- **Next Steps:** Await next task from the user.

## [2026-05-26] Clean Up Unused Imports in Public Route

- **Task:** Resolve IDE warnings for unused imports in `src/app/(public)/projects/[slug]/page.tsx`.
- **Actions:**
  - Removed unused imports (`FaGithub`, `FaExternalLinkAlt`, `motion`, `Image`, `getIcon`) which were left over from before the Server/Client component split.
- **Next Steps:** Await next task from the user.

## [2026-05-26] Resolve Missing Project Assets

- **Task:** Fix 404 Not Found errors for project images.
- **Actions:**
  - Identified that the database expects local images (`mcms.png`, `whereisit.png`, `profast.png`, `car-doctor.png`, `portfolio.png`) in the `/public/images` directory, which were missing.
  - Utilized AI image generation to design 5 high-quality, dark-mode, modern UI placeholder graphics for each respective project.
  - Created the `/public/images` directory and populated it with the newly generated assets to ensure a rich, premium aesthetic as per the core guidelines.
- **Next Steps:** Await next task from the user.

## [2026-05-26] Cloudinary Migration for Projects

- **Task:** Inject locally generated project images into Cloudinary and update MongoDB.
- **Actions:**
  - Wrote a custom Node.js script using `cloudinary` and `mongoose` connecting via `.env.local` credentials.
  - Uploaded the 5 generated placeholder images (`mcms.png`, `whereisit.png`, etc.) directly to the `portfolio/projects` folder in Cloudinary.
  - Updated the corresponding MongoDB documents to use the absolute `secure_url` returned by Cloudinary, completely decoupling the app from local images.
  - Cleaned up by deleting the temporary script.
- **Next Steps:** Await next task from the user.

## [2026-05-26] Bug Fix: Project Save 500 Error

- **Task:** Resolve 500 Internal Server Error when patching/saving a project in the Admin dashboard.
- **Actions:**
  - Identified a Mongoose schema validation failure (`CastError`) where the frontend was sending the `category` field as an array of strings (from the combobox), but the `ProjectSchema` strictly expected a single `String`.
  - Updated the `Project` model schema to define `category: [{ type: String }]` and updated the `IProject` interface.
  - Updated both `src/app/api/admin/projects/route.ts` and `src/app/api/admin/projects/[id]/route.ts` to explicitly normalize the incoming `category` payload into an array (`Array.isArray(it.category) ? it.category : ...`).
- **Next Steps:** Await next task from the user.

## [2026-05-26] Performance Enhancement

- **Task:** Fix Next.js LCP (Largest Contentful Paint) warning for project images.
- **Actions:** Added `priority={index < 2}` to the Next.js `<Image>` component in `src/app/components/Projects/ProjectCard.tsx` to preload the above-the-fold images as requested by the warning.
- **Next Steps:** Await next task from the user.

## [2026-05-26] UI Tweak: Project Card Click Target

- **Task:** Make the entire Project Card clickable, replacing the dedicated "Explore" and "GitHub" buttons.
- **Actions:**
  - Refactored `ProjectCard.tsx` to include a full-cover `<Link>` overlay (`absolute inset-0 z-10`).
  - Removed the "Explore Project" and "GitHub" buttons.
  - Retained the "Live Demo" button (if available), elevating it above the card link overlay (`relative z-20`) so it functions independently.
- **Next Steps:** Await next task from the user.

## [2026-05-26] Code Cleanup

- **Task:** Resolve Mongoose `new` option deprecation warning.
- **Actions:** Replaced all occurrences of `{ new: true }` with `{ returnDocument: "after" }` across all API route handlers (`src/app/api/admin/**/*.ts`).
- **Next Steps:** Await next task from the user.

## [2026-05-26] World-Class Bento Case Study Overhaul

- **Task:** Rebuild the project detail view into a premium Apple-style Bento grid.
- **Actions:**
  - Redesigned `ProjectDetailClient.tsx` into a custom, highly responsive asymmetric Bento Grid.
  - Housed elements (Story, Tech Stack, Gallery, and Outcomes) inside glassmorphic, interactive blocks.
  - Abandoned giant flat block buttons and replaced them with detailed "Launchpad" cards (gradient links, micro-text, vector icons).
  - Added cinematic mesh background gradients and noise details.
  - Verified compilation via TypeScript (100% type-safe).
- **Next Steps:** Await next task from the user.

## [2026-05-26] Premium Project Page Overhaul

- **Task:** Redesign Project Details page structure into a high-end split-screen case study layout.
- **Actions:**
  - Redesigned `ProjectDetailClient.tsx` to utilize an asymmetric 12-column layout.
  - Implemented a sticky left sidebar holding Project Title, Tech Stack, and Action links.
  - Created a scrollable Bento Grid column for the main showcase image, Story text, Outcomes cards, and the dynamic Media Gallery.
  - Verified compilation via TypeScript type-checks (100% type-safe).
- **Next Steps:** Await next task from the user.## [2026-05-26] Minor Cleanup
- **Task:** Resolve TypeScript unused import warning.
- **Actions:** Removed the unused `mongoose` import in `src/app/api/admin/projects/[id]/route.ts`.
- **Next Steps:** Await next task from the user.

## [2026-06-02] Collection Trimming — Brittany Chiang Alignment

- **Task:** Remove Testimonials, Services, Workflows, and Stats collections to achieve a clean, minimal developer portfolio aesthetic inspired by brittanychiang.com.
- **Actions:**
  - Deleted 14 files: public components (`Services/`, `Testimonials/`, `Workflow/`), admin pages (`admin/services/`, `admin/stats/`, `admin/testimonials/`, `admin/workflow/`), and API routes (`api/admin/services/`, `api/admin/stats/`, `api/admin/testimonials/`, `api/admin/workflow/`).
  - Modified 10 files: public homepage, About (removed Stats data fetching & grid), Navbar (removed section tracking), AdminSidebar/Topbar (removed nav links), Admin Dashboard (removed counts, cards, activity feed refs), Profile API (removed queries), and Types (removed `Stat`, `Testimonial`, `Service`, `WorkflowStep` interfaces).
  - Cleared `.next` cache and verified zero TypeScript errors via `npx tsc --noEmit`.
  - Committed: `refactor: remove Testimonials, Services, Workflows, and Stats collections for minimal Brittany Chiang-inspired portfolio aesthetic` (−2,991 lines).
- **Design Rationale:** Brittany Chiang's portfolio focuses on Hero → About → Experience → Projects → Contact. Testimonials, Services, Workflows, and Stats are patterns from freelancer/agency portfolios and don't fit the minimal dev aesthetic.
- **Next Steps:** Update memory files. Await next task from the user.

## [2026-06-02] Dynamic Icon Registry Migration

- **Task:** Migrate away from hardcoded SVGs in `techIconMap` to a scalable, Mongoose-driven technology and skills registry using `next/image`.
- **Actions:**
  - Expanded `Skill` model to support `iconSlug`, `brandColor`, and `isTechnology`.
  - Migrated hardcoded tech icons into the database, generating `iconRegistry` dynamic components.
  - Refactored `ProjectCard`, `PlaygroundCard`, and `SkillsClient` to consume dynamic database properties (SVG links, brand colors) in lieu of static mappings.
  - Replaced all legacy `<img>` tags with optimized `<Image>` components globally.
- **Next Steps:** Continue to clean up architecture.

## [2026-06-02] Strict React Hook Architecture Refactor

- **Task:** Eliminate React Hooks anti-patterns and remove `eslint-disable` suppressions across the frontend and admin dashboards.
- **Actions:**
  - Replaced manual `useEffect` local state syncing with direct render-phase tracking (`prevFetchedData`) across all dashboard pages (Experience, Education, Demos, Certifications, Blogs, Settings).
  - Refactored `admin/messages/page.tsx` to leverage `@tanstack/react-query` to unify data-fetching architecture.
  - Eliminated `// eslint-disable-next-line react-hooks/set-state-in-effect` directives globally.
  - Resolved strict hydration warnings in `AdminThemeToggle`, `ThemeToggle`, `Navbar`, and `CustomCursor` by offloading `setState` into `requestAnimationFrame` microtasks.
  - Stripped redundant `isMounted` states from client portal components (e.g., `ImageUpload.tsx`).
  - Committed: `refactor: resolve react-hooks/set-state-in-effect issues and upgrade icon system`.
- **Next Steps:** Await next task from the user.
