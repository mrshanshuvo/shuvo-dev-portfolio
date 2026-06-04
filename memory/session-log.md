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

## [2026-06-03] Skill Architecture Split and Admin UI UX Refinement

- **Task:** Separate the overloaded `Skill` model into distinct `Skill` (Expertise) and `Technology` models, and refine the Admin UX.
- **Actions:**
  - Created a new Mongoose model `Technology` and migrated existing tech brands from the `skills` collection.
  - Refactored `api/admin/skills` to `api/admin/expertise` and created `api/admin/technologies`.
  - Updated the Admin Dashboard to separate `/admin/expertise` and `/admin/technologies`.
  - Built an interactive, inline "Quick Add Technology" form within the Expertise editor, featuring a micro-animated `+` button that toggles a streamlined, fixed-layout `ImageUpload` component.
  - Updated the public `SkillsClient` to consume and render the split data accurately.
  - Formatted badges to use optimized `next/image` components for tech logos.
  - Redesigned the Admin Technologies page, converting standard badges into a responsive, premium Glassmorphic Bento Grid with hover scaling, animated dark overlays for action buttons, and dynamic neon glow based on `brandColor`.
  - Added `brandColor` property to the `Technology` Mongoose model and TypeScript interfaces for type-safety.
  - Enhanced contrast accessibility for purely black icons (e.g. Next.js, GitHub) by ensuring the logo container consistently renders a solid white background regardless of the user's color scheme mode (light/dark mode).
  - Fine-tuned the public `SkillsClient` UI by adjusting card layouts and maximizing logo size to fit the premium aesthetic.
  - Committed all changes to version control.

## [2026-06-03] Admin UI Enhancements: Drag & Drop and Usability

- **Task:** Standardize drag-and-drop interactions and refine action button usability across all list-based Admin UI pages.
- **Actions:**
  - Standardized `DndContext` architecture by moving it to the page root to prevent clipping constraints.
  - Extracted high-fidelity `<DragOverlay>` components (e.g., `CertOverlay`, `ProjectOverlay`) out of standard tables so dragging items display rich metadata (images, icons, details) instead of just the title.
  - Rectified Framer Motion conflict where layout animations broke `dnd-kit`'s positional tracking.
  - Removed hover-only constraints on all Edit and Delete buttons across 7 admin pages, making them permanently visible for better accessibility and UX.
  - Resolved lingering TypeScript errors in `admin/demos/page.tsx` related to the newly decoupled `Technology` model.
- **Next Steps:** Await next task from the user.

## [2026-06-03] Version Control Snapshot

- **Task:** Commit recent Admin UI enhancements and Drag & Drop standardizations.
- **Actions:**
  - Staged all changes across `/admin` route pages and memory documentation.
- **Next Steps:** Await next task from the user.

## [2026-06-03] Bug Fix: Project Form Technology Fetching

- **Task:** Fix TypeScript error in project edit page caused by deprecated `Skill` model reference.
- **Actions:**
  - Replaced legacy `Skill` type with `Technology` interface in `src/app/(admin)/admin/projects/[id]/page.tsx`.
  - Updated API fetch logic to hit `/api/admin/technologies` instead of `/api/admin/skills`.
  - Resolved `Property 'isTechnology' does not exist on type 'Skill'` build error.
- **Next Steps:** Await next task from the user.

## [2026-06-03] Bug Fix: Project Card techNames Undefined Error

- **Task:** Fix 500 error in `ProjectCard` and `ProjectDetailClient` caused by missing `techNames` array on newly migrated or incomplete project documents.
- **Actions:**
  - Added a fallback empty array (`(project.techNames || [])`) before `.slice()` and `.map()` calls in `src/app/components/Projects/ProjectCard.tsx` and `src/app/(public)/projects/[slug]/ProjectDetailClient.tsx`.
  - Verified fix with a successful `pnpm build`, ensuring all static pages compile perfectly.
- **Next Steps:** Await next task from the user.

## [2026-06-03] Social Links Custom Icon Migration & Fix

- **Task:** Allow dynamic custom image uploads for Social Links and decouple them from the Hero API.
- **Actions:**
  - Added `iconUrl` and `brandColor` to `SocialLink` model and types.
  - Refactored `api/admin/hero/route.ts` to remove the destructive `deleteMany` bulk replace logic for social links.
  - Upgraded `/admin/socials/page.tsx` to include `ImageUpload` and brand color inputs, rendering native `next/image` in drag overlays and tables.
  - Updated `HeroClient.tsx` and `Contact.tsx` public components to natively render custom images with fallback to standard React Icons.
- **Next Steps:** Await next task from the user.

## [2026-06-03] Social Links Modernization & Smart Dark Mode

- **Task:** Strip legacy hardcoded React Icons logic from Social Links and introduce Smart Dark Mode inversion for uploaded black logos.
- **Actions:**
  - Removed platform enum entirely from SocialLink.ts schema and interfaces.
  - Refactored HeroClient.tsx and Contact.tsx to handle links intelligently based on label string matching (e.g. mailto: for "email") instead of checking the deprecated platform field.
  - Added invertDark boolean to SocialLink DB schema and admin panel to allow users to dynamically apply dark:invert CSS filters to pure black logos (e.g., GitHub, Medium) when users switch to dark mode.
  - Fixed Next.js Image aspect ratio warnings and UI blowup issues by enforcing explicit w-[24px] h-[24px] boundaries.
  - Tweaked Hero UI tooltip positioning so tooltips open cleanly below the icon with correct caret placement.
- **Next Steps:** Await next task from the user.
## [2026-06-04] Project and Playground Card Redesign & Alignment

- **Task:** Update the visual design, hover effects, and typography hierarchy for project and playground cards, aligning them with the minimal premium aesthetic.
- **Actions:**
  - **Project Card Redesign:** Rebuilt `ProjectCard.tsx` with a full-cover background image and a dark gradient overlay. Removed the legacy 3D tilt interactions in favor of high-fidelity, performance-optimized CSS hover transitions (subtle emerald shadow glow, border highlights, image scale, and text brightening).
  - **Color Separation:** Applied distinct colors to the card elements: title in `text-emerald-400` default (to `text-emerald-300` on hover), description in `text-slate-300` (to `text-slate-100` on hover), and tech badges in soft `text-emerald-300` with tinted border washes.
  - **Arrow Micro-animations:** Integrated a standard external link arrow icon (`↗`) next to the title that smoothly fades in and translates up/right on card hover.
  - **Playground Card Alignment:** Completely refactored `PlaygroundCard.tsx` to match the exact full-cover layout, fixed heights (`h-100 sm:h-112.5`), and visual structure of `ProjectCard.tsx`. Replaced the legacy 3D tilt effects with identical hover transitions tailored to a custom purple brand theme (`text-purple-400` title, `text-slate-300` description, and `text-purple-300` tech badges).
  - **Removed GitHub Link:** Removed the GitHub link button/icon from `PlaygroundCard.tsx` as requested by the user, leaving the direct live lab button.
  - **Archive View Badges Fix:** Resolved missing technology badges in the complete projects archive view (`/projects`) by fetching the `iconRegistry` in `projects/page.tsx` and passing it down to `ProjectsArchiveClient` and each nested `ProjectCard`.
- **Next Steps:** Await next task from the user.

## [2026-06-04] Database Relational Refactoring & Data Migration (Option B)

- **Task:** Refactor data relations for projects and playground demos to reference the split `Technology` model instead of the overloaded `Skill` model, perform a database migration, and restore all tech badges in the public UI.
- **Actions:**
  - **Models & Types Refactored:** Modified `Project.ts` and `Demo.ts` models to rename `skillIds` to `technologyIds` and set references to the `"Technology"` model. Updated `types/index.ts` frontend interfaces.
  - **API Routes Updated:** Refactored admin (`api/admin/projects` & `api/admin/demos`) and public API routes (`api/projects`) to query and populate `technologyIds`, mapping them back to strings (`techNames` and `tech`) for full backwards-compatibility.
  - **Server Components & Page Fetches:** Added `.populate("technologyIds")` to Next.js page files and layout components for projects and playground pages, ensuring technology badges populate correctly when rendering server-side.
  - **Registry Fixed:** Modified `iconRegistry.ts` to query the `Technology` collection directly.
  - **Database Migration Executed:** Created and executed a database migration script `src/scripts/migrate-to-technology-ids.ts` that dynamically registered missing technology documents (e.g. Firebase, Leaflet, TensorFlow.js, Three.js, R3F, GLSL, Webcam API) in MongoDB and mapped existing project and demo entries to their correct technology ObjectIds.
  - **Documentation Updated:** Updated `docs/database_er_diagram.md` to document the revised project and demo schemas and the new `Technology` collection. Updated the architecture decision record in `decisions.md`.
  - **Tech Badge Icon Stretch Bug Fix:** Resolved a visual bug where technology logo SVGs and images within project and playground cards were stretched into horizontal capsules due to `w-auto h-auto` flex items override. Replaced with `shrink-0 w-3.5 h-3.5` constraints.
  - **Media Gallery Manager UI Cleanup:** Conditionally hid the redundant "URL / Source" text input field for `"image"` and `"video"` type assets in [MediaGalleryManager.tsx](file:///c:/Users/Shovu/Desktop/portfolio/shuvo-portfolio/src/app/(admin)/admin/components/MediaGalleryManager.tsx). It remains visible only for `"embed"` types (where direct URL input is necessary).
  - **Media Gallery Manager Layout Alignment:** Improved layout structure by using a `flex flex-col justify-between py-1` wrapper on the right-hand column and nesting input fields inside a grouped wrapper. This aligns the header information row and the caption input field perfectly with the top and bottom bounds of the left-hand image/video thumbnail uploader.
  - **Uploader Aspect Ratio Optimization:** Refactored [ImageUpload.tsx](file:///c:/Users/Shovu/Desktop/portfolio/shuvo-portfolio/src/app/(admin)/admin/components/ImageUpload.tsx) to accept a configurable `aspect` prop (`"square"` or `"video"`), defaulting to `"square"`. Configured [MediaGalleryManager.tsx](file:///c:/Users/Shovu/Desktop/portfolio/shuvo-portfolio/src/app/(admin)/admin/components/MediaGalleryManager.tsx) to pass `aspect="video"`. This renders project showcase screenshot uploaders in 16:9 landscape aspect ratio instead of 1:1 square, significantly reducing vertical height, eliminating letterbox/cropping issues for mockups, and balancing the layout of the entire card row.
  - **Project Edit Page Save Button Refactoring:** Removed the sticky top header from [page.tsx](file:///c:/Users/Shovu/Desktop/portfolio/shuvo-portfolio/src/app/(admin)/admin/projects/[id]/page.tsx). Replaced it with a clean, static, non-sticky page header block inside the main layout, and moved the "Save Changes" / "Create Project" action button to float at the bottom right corner of the screen matching the UX pattern established in the Hero section.
- **Next Steps:** Await next task from the user.






