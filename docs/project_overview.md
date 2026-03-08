# Tech Market - Project Overview

## Purpose
Tech Market is an electronics store pet-project designed to serve as a practical learning playground for modern web development technologies. The primary focus is deeply integrating **PayloadCMS (v3)** with **Next.js**, leveraging new **React 19** features, specifically **React Server Components (RSC)** and **Server Actions**. The frontend will strictly follow the **Feature-Sliced Design (FSD)** architectural methodology.

## Current State
The project currently has a robust backend infrastructure set up using PayloadCMS. The core database schema for an e-commerce platform is already defined, including collections for Products, Brands, Categories, Users, Cart, Wishlist, and Reviews. 

The storefront frontend is currently scaffolded in the `app/v1` directory. **Note:** This is a temporary folder structure and name. It will be renamed and restructured to properly adhere to **Feature-Sliced Design (FSD)** principles as development progresses.

## Tech Stack
* **Framework:** Next.js (App Router, v16.2 Canary)
* **Frontend Architecture:** Feature-Sliced Design (FSD)
* **UI Library:** React 19 (RSC, Server Actions)
* **CMS / Database Interface:** PayloadCMS (v3) running natively inside Next.js. Payload acts as the primary data access layer.
* **Database:** PostgreSQL (via `@payloadcms/db-postgres`)
* **ORM (Under the hood):** Prisma. (Note: Prisma operates invisibly behind Payload. You don't need to write Prisma queries; use Payload's Local API).
* **Styling:** Tailwind CSS v4
* **API:** Default Payload GraphQL & REST APIs, Next.js Server Actions
* **Rich Text:** Lexical Editor
