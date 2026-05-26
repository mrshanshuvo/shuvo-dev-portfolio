# System Architecture

## Overview
This document outlines the architectural structure of the Shuvo Portfolio project. The app is built on the Next.js App Router paradigm, strictly separating Server Components from Client Components.

## Directory Structure
```text
src/
├── app/
│   ├── (public)/     # Public-facing portfolio pages
│   ├── (admin)/      # Protected admin dashboard
│   ├── (auth)/       # Authentication pages (login)
│   ├── api/          # Next.js API Routes (Serverless Functions)
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global Tailwind styles
├── components/       # Reusable UI components (Shadcn, Base UI)
├── lib/              # Utility functions and configurations
└── models/           # Mongoose schemas (MongoDB)
```

## Data Flow
1. **Client to Server:** Client components use React Query (`@tanstack/react-query`) to fetch and mutate data from `/api` routes.
2. **API to DB:** The Next.js `/api` routes connect to MongoDB using Mongoose, parse the request, interact with models, and return JSON.
3. **Server Rendering:** Public pages fetch data directly on the server (using Server Components) for optimal SEO and performance before sending HTML to the client.

## Design System
- **Tailwind CSS:** Utility-first styling.
- **Shadcn UI:** Unstyled components customized via Tailwind.
- **Framer Motion:** Used for complex animations and page transitions.
