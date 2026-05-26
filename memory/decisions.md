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
