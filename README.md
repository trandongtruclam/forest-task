# Forest Facility Management Dashboard

A working prototype of an admin dashboard for managing facilities, bookings, and usage insights across a forest campus environment.

**Stack**: Next.js 16 (App Router) + Tailwind CSS v4 + Go (Gin) + PostgreSQL (Supabase)

---

## Setup

### Backend (Go + Supabase/PostgreSQL)

```bash
cd backend
cp .env.example .env
# Edit .env → set DIRECT_URL to your Supabase connection string
go run .
```

- API: `http://localhost:8081/api`
- Swagger UI: `http://localhost:8081/swagger/index.html`
- Auto-migrates the `bookings` table and seeds sample data on first run

### Frontend (Next.js)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

- App: `http://localhost:3000`
- Connects to backend via `NEXT_PUBLIC_API_BASE` (default `http://localhost:8081/api`)

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/bookings` | List all bookings (desc by date) |
| GET | `/api/bookings/:id` | Get a single booking |
| POST | `/api/bookings` | Create a booking |
| PUT | `/api/bookings/:id` | Update a booking |
| DELETE | `/api/bookings/:id` | Delete a booking |
| GET | `/api/stats` | Dashboard stats (counts, uniques) |
| GET | `/api/health` | Health check |

---

## UI Implementation Approach

The dashboard translates the Figma design into a component-based layout with clear visual hierarchy: stat cards at the top, a bookings table taking the primary area, and sidebar widgets (facility usage, campus map) on the right.

**Component architecture**:

```
app/
  (dashboard)/              ← Route group (no URL segment)
    layout.tsx              ← Shared shell: sidebar + header
    page.tsx                ← Server Component: fetches data, composes widgets
    error.tsx               ← Error boundary with retry
    facilities/page.tsx     ← Placeholder routes for sidebar nav
    booking-rules/page.tsx
    geojson/page.tsx
    users/page.tsx
    reports/page.tsx
  components/
    layout/                 ← Shell components (sidebar, header, mobile nav)
    dashboard/              ← Page-specific widgets (stats, bookings, usage, map)
    ui/                     ← Reusable primitives (StatCard, Avatar)
  lib/
    api.ts                  ← Typed fetch wrappers + data types
    utils.ts                ← cn() utility for conditional classnames
```

**Key components**:

- `StatCard` -- Reusable metric card with label, value, optional trend indicator, and optional badge. Used by `StatsOverview` for all four dashboard metrics.
- `Avatar` -- Extracted from three duplicate implementations into one component with size variants.
- `RecentBookings` -- Server component (no `"use client"`). Receives bookings as props from the page. Includes `StatusBadge` (lookup-based color system) and `FacilityIcon` (config-map pattern instead of if/else chains).
- `Sidebar` -- Data-driven nav using `<Link>` + `usePathname()` for active state. Auto-closes on mobile after navigation.
- `Header` -- Dynamic page title derived from pathname. Search bar, notification bell, user avatar.

**Responsive behavior**:

- Sidebar collapses to a drawer on mobile with overlay backdrop
- Stat grid: 4 columns → 2 → 1
- Bookings table scrolls horizontally on narrow viewports
- Mobile header with hamburger menu replaces the desktop header

**Styling**: Tailwind CSS v4 with Geist font family. Minimalist design with slate/green palette, soft borders, subtle hover transitions. No custom CSS beyond base resets in `globals.css`.

---

## Architectural Decisions

### Server Components for data fetching

The dashboard page is an `async` Server Component that fetches bookings and stats in parallel via `Promise.allSettled`. This eliminates the client-side fetch waterfall (mount → fetch → render) and delivers data-populated HTML on first load. Components like `RecentBookings` and `StatsOverview` are purely presentational -- they receive data as props and contain zero client-side state.

### Route group for shared layout

The `(dashboard)` route group wraps all pages in a shared layout (sidebar + header) without adding a URL segment. This means `/` renders the dashboard, `/facilities` renders the facilities page, etc. -- all within the same shell. Adding a new page is just creating a folder with a `page.tsx`.

### Error boundary

`(dashboard)/error.tsx` catches unhandled errors at the route level with a retry button. The dashboard page also handles fetch failures gracefully via `Promise.allSettled` -- if the backend is down, stats show dashes and the bookings section shows a warning, but the rest of the page still renders.

### Backend simplicity

The Go backend is intentionally kept as a single-file API. For a prototype, this avoids premature abstraction. It uses GORM for PostgreSQL access, auto-migrates on startup, and seeds sample bookings if the table is empty. Swagger docs are auto-generated for API exploration.

### Data modeling

`Booking` is the core entity with `facilityName`, `employeeName`, `dateTime`, and `status` (Confirmed/Pending/Completed/Cancelled). The `/api/stats` endpoint derives dashboard metrics (total count, pending count, distinct facility count, distinct employee count) from the bookings table directly, so stats are always consistent with actual data.

---

## Prioritized vs. Left Out

**Prioritized**

- Dashboard layout faithful to the design's structure and intent
- Live bookings from a real database with full CRUD
- Server-side data fetching for performance and SEO
- Working navigation with route group architecture
- Error handling at both component and route level
- Clean component extraction (Avatar, StatCard, StatusBadge, FacilityIcon)
- Responsive layout with mobile sidebar drawer

**Intentionally left out**

- Authentication and role-based access
- Full CRUD UI for facilities, users, and booking rules (backend endpoints exist for bookings; other pages are placeholder stubs)
- Real map integration (campus map is a styled placeholder card)
- Facility usage wired to backend (uses representative dummy data as permitted)
- Search functionality (search bar is present but not wired to a query)
- Pixel-perfect Figma match (focused on structure and interaction patterns over exact spacing)

---

## AI-Supported Workflow

I used **Cursor (Agent mode)** throughout development, treating it as a pair-programming partner rather than a code generator.

**Where AI accelerated the work**:

- **Component scaffolding**: AI generated the initial component structure (StatCard, Sidebar, Header, BookingsTable) from the design description. This saved significant boilerplate time and produced clean, idiomatic Tailwind code on the first pass.
- **Backend CRUD**: The Go API with Gin + GORM, including Swagger annotations and seed data, was largely AI-generated. I directed the data model and endpoint design; AI handled the repetitive handler implementations.
- **Refactoring at scale**: When I decided to move from client-side fetching to Server Components, AI handled the multi-file refactoring (removing `"use client"`, restructuring props, creating the route group, updating imports) across 18 files in one coherent pass.
- **Design system iteration**: The UI redesign (switching from a dark sidebar gradient to a light theme, extracting Avatar, replacing inline SVGs with Lucide icons) was done through AI with design direction from me.

**Where AI needed correction or didn't help**:

- **Stale cache issues**: After restructuring routes, the Next.js `.next` cache caused a build failure referencing a deleted file. AI didn't predict this; I identified the issue and directed the cache clear.
- **Design judgment**: AI produced functional but generic layouts. The color palette choices, spacing decisions, and visual hierarchy required my direction -- AI executed the implementation but I made the aesthetic decisions.
- **CSS custom properties**: AI initially created design tokens in `globals.css` that were never consumed by any component (everything used Tailwind utility classes directly). I caught this during code review and had AI clean them up.

**How I validated AI output**:

- `npx next build` after every structural change to catch type errors and build failures
- `go build ./...` for backend compilation checks
- Manual browser testing for layout, responsiveness, and data flow
- Linter checks (`ReadLints`) after edits to catch regressions
- I ran a structured code review through AI itself to surface issues I might have missed, then directed fixes based on the findings
