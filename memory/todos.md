# Task List & TODOs

## High Priority

- [x] **Linting Sweep:** Run `pnpm lint` and `npx tsc --noEmit` to clean up all unused imports and variables across the project.
- [ ] **Error Boundaries:** Ensure all route groups (`(admin)`, `(public)`) have appropriate `error.tsx` boundaries to prevent whole-app crashes.

## Medium Priority

- [ ] **SEO Optimization:** Audit public routes for proper metadata, OpenGraph images, and semantic HTML.
- [ ] **Admin Authentication Validation:** Ensure middleware strictly protects all `/admin` routes.
- [ ] **Rate Limiting:** Implement basic rate limiting for public-facing API routes (e.g., contact form submissions).

## Low Priority / Suggested Improvements

- [ ] **Testing:** Set up Jest or Playwright for critical path testing (e.g., login, contact form).
- [ ] **Accessibility (a11y):** Run Lighthouse tests on the public portfolio to ensure adequate color contrast and ARIA labels.
- [ ] **Analytics:** Integrate Vercel Analytics or a custom visitor tracking model for the Admin Dashboard Visitor Chart.
