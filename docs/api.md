# API Documentation

## Overview

The application utilizes Next.js Route Handlers (`src/app/api`) to construct a RESTful API. This API is consumed primarily by the Admin Dashboard via React Query.

## Authentication

All admin-modifying API routes must be protected. NextAuth.js session tokens are validated on the server before proceeding with any database mutations.

## Core Endpoints (Example Structure)

### `GET /api/projects`

- **Description:** Retrieves all portfolio projects.
- **Access:** Public
- **Response:** Array of Project objects.

### `POST /api/projects`

- **Description:** Creates a new portfolio project.
- **Access:** Admin Only
- **Payload:** Title, description, image URL, tech stack, etc.

### `PUT /api/hero`

- **Description:** Updates the main hero section text and assets.
- **Access:** Admin Only

_(Note: Endpoints should be fully mapped here as they are finalized in the codebase.)_
