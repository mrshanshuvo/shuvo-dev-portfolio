# Architectural Decisions Record (ADR)

_This file tracks significant design and architectural decisions made during development._

## Template

### [Date] - [Decision Title]

- **Context:** Why is this decision being made?
- **Decision:** What is the actual decision?
- **Consequences:** What are the pros/cons and impacts of this decision?

---

### [Initial] - Next.js App Router & Mongoose

- **Context:** Needed a full-stack framework with SEO capabilities and a flexible NoSQL database for rapid schema iteration.
- **Decision:** Selected Next.js App Router for server components and routing, paired with MongoDB/Mongoose.
- **Consequences:** Faster initial page loads via server-side rendering, but requires careful handling of Server vs. Client components.

### [Initial] - Custom Admin Dashboard vs. Headless CMS

- **Context:** The portfolio needs content updates.
- **Decision:** Build a custom admin dashboard directly in the project (`/admin`) instead of using Sanity or Strapi.
- **Consequences:** Higher initial development cost but zero external dependencies and total control over the UI/UX of the CMS.

### [2026-06-02] - Trim Collections to Match Brittany Chiang Aesthetic

- **Context:** The portfolio had 19 collections including agency-style features (Testimonials, Services, Workflows, Stats) that don't fit a minimal developer portfolio inspired by brittanychiang.com.
- **Decision:** Remove Testimonials, Services, Workflows, and Stats entirely — models, types, API routes, admin pages, and public components. The retained flow is: Hero → About → Experience → Projects → Playground → Skills → Education → Certifications → Blog → Contact.
- **Consequences:** Simpler codebase (−2,991 lines), tighter public page flow, fewer admin sections to manage. The Mongoose models and MongoDB collections still exist in the database but are no longer referenced by the app. They can be dropped manually if desired.

### [2026-06-02] - Centralized DB-Driven Tech Icons

- **Context:** Icons and tech stack identifiers were hardcoded in `techIconMap.ts`, resulting in duplicate imports, bundle bloat, and inability to manage skills via CMS.
- **Decision:** Deprecate static maps and migrate `isTechnology`, `iconSlug`, and `brandColor` into the `Skill` MongoDB schema. Use a dynamic `iconRegistry` helper and `next/image` to render brand-aligned icons.
- **Consequences:** Admin users can fully manage the tech stack without codebase deployments. Removed SVG bloat and standardized Next.js image loading.

### [2026-06-02] - Strict React Hook Adherence & Render-Phase Updates

- **Context:** The codebase used `useEffect` extensively to synchronize local component state with fetched data, triggering a custom ESLint warning (`react-hooks/set-state-in-effect`) about cascading renders, which had been previously suppressed using `eslint-disable`.
- **Decision:** Remove all `eslint-disable` suppressions. Adopt render-phase state synchronization by explicitly tracking previous state references during the render cycle instead of inside `useEffect`. For hydration bypassing, leverage `requestAnimationFrame` to delay the state update asynchronously without triggering synchronous `setState` in effect warnings.
- **Consequences:** Cleaner, strictly compliant React architecture with zero suppressed linter errors. Resolves cascading render performance hits, though requires slightly more verbose boilerplate for render-phase checking.

### [2026-06-03] - Split Skill Model into Expertise and Technologies

- **Context:** The `Skill` model was overloaded, serving both as high-level professional "Expertise Areas" (e.g., Full Stack Development) and granular "Technologies/Brands" (e.g., React, Node.js). This made the admin UI confusing and the public UI filtering logic complex.
- **Decision:** Split the `Skill` model into two distinct Mongoose models: `Skill` (representing Expertise) and `Technology` (representing individual tech stack items with icons). Updated the admin dashboard to have separate `/admin/expertise` and `/admin/technologies` routes, and implemented an inline "Quick Add" UX for adding technologies directly from the Expertise form.
- **Consequences:** Cleaner separation of concerns, simpler public UI filtering logic, and a vastly improved admin authoring experience with type-safe associations.

### [2026-06-03] - Standardized Admin Drag & Drop Architecture

- **Context:** Drag-and-drop interactions across admin list pages were behaving inconsistently, specifically due to clipping overlays within scrollable containers and conflicts with Framer Motion layout animations.
- **Decision:** Extract `DndContext` to the root `<div>` level for all sortable list pages to ensure `DragOverlay` elements render above all context layers. Remove `layout` prop from `framer-motion` implementations on actively sorting elements to avoid transform tracking conflicts with `dnd-kit`. Create rich, decoupled `<DragOverlay>` components representing metadata (icons, dates, issuers) to ensure high-fidelity drag feedback.
- **Consequences:** Visual drag feedback is perfectly stable, consistent across all 7 CMS list pages, and doesn't get clipped. Required refactoring 7 distinct admin UI pages.

### [2026-06-03] - Decouple Social Links from Hero State Management

- **Context:** The Admin Hero Page saved the state of Social Links by deleting all of them and inserting the state back into the DB on every save. Since we created a dedicated Admin Socials page with independent drag-and-drop and custom icon capabilities, this behavior was a destructive anti-pattern.
- **Decision:** Remove `SocialLink` mutation logic from the Hero API entirely. Allow the Socials page to be the absolute source of truth and sole manager of social links.
- **Consequences:** Prevents data loss (custom icons, brand colors) when updating the hero profile. Better separation of concerns.
### [2026-06-03] - 100% Dynamic CMS-Driven Social Links

- **Context:** Social links previously relied on a hardcoded "Network" enum string (e.g. "LinkedIn") that explicitly mapped to a static \eact-icons\ library import and hardcoded hover colors. This was rigid and required code changes to add a new social platform. Additionally, users uploading pure black logos found them invisible in dark mode.
- **Decision:** Remove all static \eact-icons\ mappings from the public UI. The system now strictly relies on the Cloudinary \iconUrl\ and user-input \randColor\. Furthermore, to solve the dark mode visibility issue, added an \invertDark\ boolean field that dynamically applies CSS inversion (\dark:invert\) to specific icons without sacrificing the dark mode aesthetic with bright button backgrounds.
- **Consequences:** The system is completely decoupled from static icons. Admin users have 100% autonomy over links, icons, and hover colors. Solves contrast issues elegantly at the CSS level.

### [2026-06-04] - Unified Full-Cover Cards with High-End Hover Transitions

- **Context:** The project and playground cards had inconsistent visual styles (e.g., image-top split vs mixed content) and leveraged legacy 3D tilt hover hooks that were heavy, custom-scripted, and didn't fit a modern flat-card layout. In addition, the title and description lacked distinct color contrast.
- **Decision:** Unify all public listing cards (projects & playground) to use a clean, modern, full-cover layout with dark readability gradients and matching fixed heights. Implement high-fidelity CSS transitions using standard Tailwind classes (including group-hover image scaling, fading/translating arrow icons, and glow shadow colors mapped to the card's specific theme, such as emerald for projects and purple for playground). Set titles to distinct theme colors (`text-emerald-400`/`text-purple-400`) and descriptions to a neutral (`text-slate-300`) to maximize contrast.
- **Consequences:** Creates a cohesive, premium visual language throughout the portfolio. Visual hierarchy is significantly improved with distinct colors, and performance is optimized by utilizing standard CSS transitions rather than custom Framer Motion drag hooks.

### [2026-06-04] - Database Relational Refactoring (Option B) for Project & Demo Models

- **Context:** The split of `Skill` into `Skill` and `Technology` broke tech badges on project detail views, the homepage projects grid, and playground cards. The previous developer updated the collections in MongoDB but neglected to update project/playground query populated references, admin API endpoints, and the public listing components.
- **Decision:** Implemented Option B:
  1. Renamed `skillIds` to `technologyIds` (referencing `"Technology"`) in the `Project` and `Demo` Mongoose models and type definitions.
  2. Refactored admin edit endpoints to resolve raw tech names to `technologyIds` and map them on GET.
  3. Added `.populate("technologyIds")` and mapping code in public server components and API routes.
  4. Created a database migration script that registers missing technologies (e.g. TensorFlow.js, Leaflet, Firebase, GLSL) and maps the existing projects and playground demos to their correct `technologyIds`.
- **Consequences:** Restores full visual rendering of all technology badges on all public cards (homepage grids, archive views, and details pages) while keeping the database strictly normalized.

### [2026-06-04] - Removal of Blocking Browser Confirm Dialogs

- **Context:** Admin list rows feature a custom progress loader spinner that lights up upon clicking the delete icon. Under this visual feedback mechanism, prompt-based validation dialogue blocks (`confirm()`) are redundant, slowing down content authoring workflows.
- **Decision:** Stripped blocking `confirm()` dialogues from delete handlers across all 8 CRUD collections.
- **Consequences:** Deletion is now immediate. The loading state on the individual row's trash button serves as the real-time interaction feedback.

### [2026-06-04] - Strict next/image Sizing Constraints & Class Cleanup

- **Context:** Styling `<Image>` tags with conflicting layout properties (like setting explicit `width` and `height` attributes alongside responsive `w-... h-...` class names) triggers console aspect-ratio and Cumulative Layout Shift warnings.
- **Decision:** Keep styling and properties aligned:
  - If sizing via next/image `width`/`height` props, avoid size classes (`w-` and `h-`) completely to prevent CSS overriding attributes unevenly.
  - If sizing using Tailwind or parent elements, use next/image `fill` or `style={{ width: "auto" }}` / `style={{ height: "auto" }}` to retain native scale compliance.
- **Consequences:** Completely silences Next.js image warnings across compile and browser runs, improving Cumulative Layout Shift parameters.

### [2026-06-04] - Restoring Schema Period/Duration Fields & Making Dates Optional

- **Context:** A recent optimization update to database schemas introduced strict `startDate: { type: Date, required: true }` and `endDate: { type: Date }` validation rules on the `Education` and `Experience` collections, but did not migrate the frontend forms which continue to save string-based `period` and `duration` fields. This difference resulted in validation errors and HTTP 500 status responses when inserting new documents.
- **Decision:** Made `startDate` and `endDate` optional properties inside the `Education` and `Experience` schemas and interfaces, and restored `period` / `duration` as required fields inside MongoDB and the backend models.
- **Consequences:** Restores full CMS management functionality for adding and editing education and experience records immediately, without having to overhaul the frontend forms.

