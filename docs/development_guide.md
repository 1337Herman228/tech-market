# Development Guide

## Getting Started
Ensure you have Node.js and Docker installed (for the Postgres database).

1. **Database Setup:** 
   The project includes a `docker-compose.yaml` file to spin up Postgres.
   ```bash
   docker compose up -d
   ```
2. **Environment Variables:**
   Ensure your `.env` is configured with `DATABASE_URL` and `PAYLOAD_SECRET`.
3. **Run Migrations:**
   Apply Payload schemas to the database:
   ```bash
   npm run migrate:run
   ```
4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The site is now available at `http://localhost:3000`. The admin panel is at `http://localhost:3000/admin`.

## Database Interactions (Payload vs. Prisma)
**PayloadCMS is your primary interface to the database.** While Prisma is used as the underlying ORM, it is abstracted away. 
* Do **not** write raw Prisma queries or try to use PrismaClient in your Next.js application. 
* Rely exclusively on **Payload's Local API** to fetch and mutate data. Payload handles the heavy lifting, security, and access control on top of Prisma automatically.

## Frontend Architecture Integration (FSD)
The frontend UI will strictly follow **Feature-Sliced Design (FSD)**. 
* Avoid putting all logic inside `app/v1` (which is a temporary folder name).
* As you build out the UI, organize your components, server actions, and hooks into `shared`, `entities`, `features`, `widgets`, and `pages` directories to decouple business logic from strictly UI code.

## Developing with RSC and Server Actions

### Fetching Data (React Server Components)
Inside your FSD layers (like a Server Component inside `pages` or `widgets`), use Payload's Local API:
```tsx
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function ProductWidget() {
  const payload = await getPayload({ config })
  
  // Directly hitting the DB via Payload (no fetch needed)
  const products = await payload.find({
    collection: 'products',
  })
  
  return (
    <div>
      {products.docs.map(product => <div key={product.id}>{product.name}</div>)}
    </div>
  )
}
```

### Mutating Data (Server Actions)
Use Server Actions inside your FSD `features` to handle mutations:
```tsx
'use server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function addToCartFeature(productId: string) {
  const payload = await getPayload({ config })
  
  // Use Payload to manage data changes
  await payload.create({
    collection: 'cart',
    data: { /* ... */ }
  });
}
```

## Schema Changes
* `npm run generate:types` - Re-generates `payload-types.ts` based on your collections. Do this every time you modify a collection in `src/payload/collections/`.
* `npm run migrate:create --name [name]` - Creates a new migration file after modifying schemas.
* `npm run migrate:fresh` - Drops the database, recreates it, clears old migrations, and runs a fresh init migration. Useful during early rapid prototyping.
