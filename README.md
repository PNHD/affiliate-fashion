# Affiliate Fashion

Affiliate product showcase website — AI fashion videos with shoppable product links.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database/Auth | Supabase |
| Icons | Lucide React |
| Validation | Zod |
| Scraping | Cheerio (server-side) |
| Deployment | Vercel (via GitHub) |

## Setup

### 1. Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **SQL Editor** → paste content of `supabase/migrations/001_initial_schema.sql` → Run
3. Go to **Project Settings → API** → copy:
   - `Project URL`
   - `anon public` key
   - `service_role` secret key

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
ADMIN_EMAILS=you@email.com
```

### 3. Auth Setup

In Supabase Dashboard → **Authentication**:
- Enable **Email/Password** provider
- (Optional) Enable **Magic Link**
- Add your admin email(s) to `ADMIN_EMAILS` env var
- Register your first admin via Supabase Auth UI or the API

### 4. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

1. Push to GitHub
2. In Vercel → Import Project → Select repo
3. Add the same environment variables in Vercel dashboard
4. Deploy

## Admin Workflow

1. Go to `/admin/login` → sign in
2. **Add Product**: paste a Shopee/TikTok/Lazada URL → auto-fetches title, images, price
3. Add your affiliate link manually
4. Link products to videos via the video manager
5. Products appear on the public site instantly

## Project Structure

```
src/
├── app/
│   ├── api/           # REST API routes
│   │   ├── scrape/    # URL scraping endpoint
│   │   ├── products/  # CRUD
│   │   ├── videos/    # CRUD
│   │   ├── click/     # Click tracking
│   │   ├── auth/      # Auth callback
│   │   └── admin/     # Admin stats
│   ├── admin/         # Admin dashboard pages
│   ├── products/      # Public product pages
│   └── videos/        # Public video pages
├── lib/
│   ├── supabase/      # Supabase clients (browser/server/admin)
│   ├── scraper/       # URL scraping logic
│   ├── utils.ts       # Helpers
│   └── validations.ts # Zod schemas
├── types/             # TypeScript types
└── middleware.ts      # Admin route protection
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List products (paginated, filterable) |
| GET | `/api/products/[id]` | Public | Single product + linked videos |
| POST | `/api/products` | Admin | Create product |
| PATCH | `/api/products/[id]` | Admin | Update product |
| DELETE | `/api/products/[id]` | Admin | Delete product |
| GET | `/api/videos` | Public | List videos |
| POST | `/api/videos` | Admin | Create video |
| POST | `/api/scrape` | Admin | Scrape URL for product data |
| POST | `/api/click` | Public | Track affiliate link click |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
