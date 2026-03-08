# Code Map

A guide to navigating the workspace.

## Root Level
* `package.json` - Defines scripts and dependencies (Next 16, React 19, Payload 3).
* `next.config.ts` - Next.js configuration, wrapped with `withPayload()` to inject the CMS.
* `payload.config.ts` (Linked via Next Config) - The primary CMS configuration file.
* `prisma.config.ts` - Setup for the underlying Postgres adapter. (Used internally by Payload, mostly untouched by developers).

## `src/` Directory
Houses the backend definitions and database migrations.
* `src/payload/payload.config.ts` - Main Payload configuration, registers collections and database adapters.
* `src/payload/collections/` - All schema definitions for the store:
  * `Products.ts` - Defines products, pricing, stock, relations to categories.
  * `Users.ts`, `Cart.ts`, `Wishlist.ts` - Customer-centric data models.
  * `Categories.ts`, `Brands.ts` - Taxonomy.
* `src/migrations/` - Auto-generated database migration files based on Payload collections.

## `app/` Directory
The Next.js App Router, split into CMS and Storefront.
* `app/(payload)/` - Generated/Managed by Payload for the CMS Admin Dashboard (`admin/`) and APIs (`api/`).
* `app/v1/` - **(Temporary Directory)** The current scaffold for the Storefront application. 
  * *Future State:* This folder will be renamed and entirely refactored into a **Feature-Sliced Design (FSD)** structure, removing the nested `v1` and organizing into architectural layers (`pages`, `widgets`, `features`, `entities`, `shared`).
  * `globals.css` - Global Tailwind v4 styles.

## Utility Folders
* `public/` - Static frontend assets.
* `media/` - Uploaded media managed by PayloadCMS.
