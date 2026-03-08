# Architecture

The application uses a **monolithic architecture** where both the CMS (backend) and the Storefront (frontend) are served by a single Next.js application.

## 1. Next.js App Router & Feature-Sliced Design (FSD)
Next.js acts as the core server, handling routing for both the admin panel and the public storefront. 
- **Admin UI & API:** Hosted under `app/(payload)`. This runs Payload natively within the Next.js process.
- **Storefront UI:** Currently scaffolded under `app/v1`. This directory is **temporary** and will be reorganized and renamed according to the **Feature-Sliced Design (FSD)** methodology (e.g., dividing code into `shared`, `entities`, `features`, `widgets`, `pages`, and `app` layers) to ensure a highly scalable and maintainable frontend codebase.

## 2. Rendering Strategy
The frontend heavily relies on **React Server Components (RSC)**. 
Because Payload is integrated natively into Next.js, storefront pages can securely and directly query the database using Payload's internal Local API (e.g., `const payload = await getPayload(...)`) without making HTTP requests. Mutations (like adding items to a cart) will be handled natively via **Next.js Server Actions**, calling Payload's local API.

## 3. Data Layer & Database Operations
- **PayloadCMS** is the main Database Interface and the absolute source of truth for schema definitions (`src/payload/collections`).
- **PostgreSQL** is the relational database storing the data.
- **Prisma** acts purely as the underlying engine that Payload uses to talk to PostgreSQL. **You do not need to use Prisma directly.** All queries, mutations, and schema migrations are handled automatically through PayloadCMS collections and the Payload Local API.

## 4. Media Handling
Media files are managed by Payload via the `Media` collection, utilizing `sharp` for image processing and outputting to the `media/` directory.
