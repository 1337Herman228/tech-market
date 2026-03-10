
# SKILL: Ultimate Frontend Developer

## Stack: Next.js 14+ · TypeScript · Tailwind CSS · Zustand · React Query/SWR · Prisma/Drizzle

---

## RULE #0 — NEVER JUST START CODING

Before writing a single line of code, you **must** complete the Planning Protocol below. Skipping this is a critical failure. Being asked to "just code it" is not an excuse to skip.

---

## PLANNING PROTOCOL

Every task — no matter how small — goes through these steps **in order**:

### Step 1 — Clarify Before Assuming

If **any** of the following is unclear, **stop and ask** before proceeding:

|Area|Questions to ask|
|---|---|
|**Scope**|Is this a new component, editing existing, or refactoring?|
|**Data**|Where does the data come from? API, local state, DB?|
|**Auth**|Does this feature require auth? Which roles can access it?|
|**Routing**|Is this a new page, a modal, a drawer? What's the URL?|
|**Error states**|What should happen on loading / error / empty?|
|**Mobile**|Is this mobile-first, desktop-first, or fully responsive?|
|**Reuse**|Is this one-off or should it be a reusable component?|

**Never assume. Never guess. Ask once, get clarity, then plan.**

### Step 2 — Write a Mini Plan (Always, Even for Small Tasks)

Before coding, output a short plan in this format:

PLAN
─────────────────────────────
Goal: [one sentence]

Files I will create:

- src/components/[Name]/[Name].tsx
- src/components/[Name]/[Name].types.ts   (if complex)

Files I will modify:

- src/app/[route]/page.tsx

State: [local useState / Zustand store / React Query]
Data: [where it comes from, what shape]
Edge cases I will handle: [loading, error, empty, auth guard]

Questions remaining (if any):

- [ask here before starting]
─────────────────────────────

Only proceed to code **after** the plan is confirmed (either explicitly by the user, or implicitly if no questions remain).

### Step 3 — Build in Order

Always implement in this sequence:

1. Types & interfaces first
2. Data layer (query / mutation / store)
3. Component structure (no styles yet)
4. Styling with Tailwind
5. Edge cases (loading, error, empty states)
6. Accessibility pass
7. Final review against the plan

---

## PROJECT STRUCTURE

Always ask what architecture and file structure you should use. For default use FSD structure where only top-layer file can import low-layer files. Don't invent new top-level folders.

example of some layer (e.g. /features). The same layers will at pages, widgets, features, entities and shared (without named folders inside)

└── [name]/                            # page/widget/entity/feature name
        ├── ui/                        # UI components
        │    ...                       # other components
        │    └── ComponentName.tsx     # component
        │
        ├── api/                       # api layer / server functions / db
        │    ├── useHook.ts            # hooks
        │    ├── mapper.ts             # if needed
        │    ├── contracts.ts          # zod/other schemas
        │    ├── services.ts           # db services if needed
        │    ...                       # other api/server logic
        │    └── types.ts              # api-types
        │
        ├── model/                     # component inside logic layer
        │    ├── useHook.ts            # hooks
        │    ├── contracts.ts          # zod/other schemas
        │    ...                       # other model logic
        │    └── types.ts              # model-types
        │
        ├── lib/                 # other layer utilities (unique data coverter)
        │
        ...                     # may be other specific folders
        │
        └── index.ts            # Re-export

src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Route groups
│   ├── api/                    # API routes
│   └── layout.tsx
│
├── pages/                      # Compounded widgets into pages components
│     └──[layer example above]
│
├── widgets/                    # Compounded components from other layers
│     └──[layer example above]
│
├── features/
│     └──[layer example above]
│
├── entities/                   # Entities components (like UserAvatar, UserCard)
│     └──[layer example above]
│
├── shared/                     # Shared files
│     └──[layer example above]

## NAMING CONVENTIONS (STRICT)

These are non-negotiable. Apply them every time.

|Thing|Convention|Example|
|---|---|---|
|Components|`PascalCase`|`UserProfileCard.tsx`|
|Hooks|`camelCase` with `use` prefix|`useUserProfile.ts`|
|Stores|`camelCase` with `Store` suffix|`userStore.ts`|
|Server actions|`camelCase` verbs|`createUser.ts`, `deletePost.ts`|
|DB queries|`camelCase` verbs|`getUserById.ts`|
|Types/Interfaces|`PascalCase`, interface preferred|`UserProfile`, `ApiResponse<T>`|
|Enums|`PascalCase`|`UserRole.Admin`|
|Constants|`SCREAMING_SNAKE_CASE`|`MAX_FILE_SIZE`|
|CSS classes|Tailwind only — no custom class names unless absolutely necessary||
|URL routes|`kebab-case`|`/user-profile/settings`|
|API endpoints|`kebab-case`, RESTful|`/api/user-posts`|

### Component File Rules

- File name = component name
- Always use named exports (not default) for components
- Exception: `page.tsx`, `layout.tsx`, `error.tsx` use default exports (Next.js requirement)

// ✅ Correct
export function UserProfileCard({ user }: UserProfileCardProps) { ... }

// ❌ Wrong
export default function Card({ data }: any) { ... }

## TYPESCRIPT RULES

// ✅ Always type props with an interface, never inline
interface UserCardProps {
  user: User
  onEdit?: (id: string) => void
  className?: string   // always allow className passthrough on UI components
}

// ✅ Use generics for reusable data shapes
interface ApiResponse<T> {
  data: T
  error: string | null
  status: number
}

// ✅ Prefer type narrowing over casting
if (error instanceof Error) {
  console.error(error.message)
}

// ❌ Never use `any` — use `unknown` and narrow it
// ❌ Never use type assertions (as X) unless absolutely unavoidable
// ❌ Never use non-null assertion (!) without a comment explaining why

---

## TAILWIND CSS RULES

// ✅ Always use cn() for conditional classes (install clsx + tailwind-merge)
import { cn } from '@/lib/utils'

<div className={cn(
  'flex items-center rounded-lg p-4',
  isActive && 'bg-blue-50 border border-blue-200',
  className   // always spread className for composability
)} />

// ✅ Extract repeated class groups to a variable, not a custom CSS class
const cardBase = 'rounded-xl border border-gray-200 bg-white p-6 shadow-sm'

// ✅ Mobile-first — unprefixed = mobile, then sm:, md:, lg:
<div className="flex flex-col gap-4 md:flex-row md:gap-8" />

// ❌ Never write custom CSS for something Tailwind can do
// ❌ Never use inline styles
// ❌ Never use arbitrary values ([px-37]) unless truly unavoidable

### Responsive Design Order

Always write classes in this order: `base → sm: → md: → lg: → xl: → dark:`

---

## DATA FETCHING

### Server Components (default — prefer this)

// app/users/page.tsx
export default async function UsersPage() {
  const users = await getUsers()  // direct DB call in server/queries/
  return <UserList users={users} />
}

### Client-side with React Query

// For client components that need fresh data, pagination, or mutations
const { data, isLoading, error } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => fetchUsers(filters),
})

// Always handle all three states
if (isLoading) return <UserListSkeleton />
if (error) return <ErrorMessage error={error} />
if (!data?.length) return <EmptyState message="No users found" />
return <UserList users={data} />

### SWR (for simpler client fetching)

const { data, error, isLoading } = useSWR('/api/user', fetcher, {
  revalidateOnFocus: false,
})

### Server Actions (mutations)

'use server'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
  // 1. Validate input (zod)
  // 2. Auth check
  // 3. DB write
  // 4. revalidatePath / revalidateTag
  // 5. Return { data, error }
}

## DATABASE (PRISMA / DRIZZLE)

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true }  // always select explicitly
  })
}

Rules:

- All DB calls live in `server/queries/` — never call `db` directly from a component
- Always `select` explicit fields — never return full records unless needed
- Wrap mutations in try/catch and return `{ data, error }` shapes

---

## STATE MANAGEMENT (ZUSTAND)

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UserStore {
  selectedUserId: string | null
  setSelectedUser: (id: string | null) => void
}

export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    selectedUserId: null,
    setSelectedUser: (id) => set({ selectedUserId: id }),
  }))
)

Rules:

- Zustand for **UI state** and **cross-component state** only
- **Never** store server data in Zustand — use React Query/SWR for that
- Always add `devtools` middleware in development
- Keep stores small and focused — one store per domain

---

## ACCESSIBILITY (NON-NEGOTIABLE)

Every interactive element must have:

- Semantic HTML (`button` not `div onClick`)
- `aria-label` when text content is absent (icon buttons)
- Keyboard navigation support
- Focus-visible styles (don't remove `outline`)
- `role` attribute when using non-semantic elements

// ✅
<button
  aria-label="Delete user"
  onClick={handleDelete}
  className="focus-visible:ring-2 focus-visible:ring-blue-500"
>
  <TrashIcon className="h-4 w-4" />
</button>

// ❌
<div onClick={handleDelete}><TrashIcon /></div>

---

## EDGE CASES — ALWAYS HANDLE THESE

Every feature must explicitly handle:

// Loading
<Skeleton className="h-10 w-full rounded-md" />

// Error
<div role="alert" className="text-red-600 text-sm">{error.message}</div>

// Empty
<p className="text-muted-foreground text-center py-8">No results found.</p>

// Unauthorized
redirect('/login')  // or show a permission denied message

// Optimistic update failure — revert state and show toast

---

## ✅ PRE-COMMIT CHECKLIST

Before calling anything done, verify:

- [ ] Plan was written and followed
- [ ] All unclear things were asked before coding
- [ ] Types are correct — no `any`, no unchecked assertions
- [ ] Naming matches conventions table
- [ ] Loading, error, and empty states all handled
- [ ] Mobile layout works
- [ ] No `console.log` left in code
- [ ] No unused imports
- [ ] `cn()` used for conditional classes
- [ ] Accessibility: semantic HTML, aria labels, keyboard nav
- [ ] DB queries are in `server/queries/`, not inline

---

## HARD RULES — NEVER DO THESE

|❌ Never|✅ Instead|
|---|---|
|Use `any` type|Use `unknown` and narrow it|
|Fetch data in a component directly|Use server component, React Query, or SWR|
|Call `db` from a component|Put it in `server/queries/`|
|Use `default export` for components|Named exports only|
|Write custom CSS when Tailwind works|Tailwind + `cn()`|
|Use inline styles|Tailwind classes|
|Store server data in Zustand|React Query / SWR|
|Write a migration without checking existing schema|Check Prisma schema first|
|Skip loading/error states|Always handle all states|
|Make assumptions about scope|Ask first|

---

## COMMUNICATION STYLE

- If something is ambiguous → ask before coding, not after
- If a request would cause a bad pattern → flag it with a better alternative
- If a task is large → suggest breaking it into steps and confirm the plan
- After finishing → briefly summarize what was done and what to test
- Flag if something touches auth, payments, or data deletion — double-check intent

---

_This skill file is a living document. When a mistake is corrected, add a rule here to prevent it next time._
