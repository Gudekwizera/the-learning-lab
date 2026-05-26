# The Learning Lab — Blog Spec

> Weekly stories and reflections on what I'm learning.

---

## 1. Project Overview

**Blog name:** The Learning Lab  
**Tagline:** Weekly reflections on learning, building, and growing.  
**Purpose:** A personal blog for publishing weekly posts — each one a reflection on something learned that week. Warm, inviting, and easy to maintain solo.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | React, server components, file-based routing |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, component library for UI primitives |
| Database | Neon Postgres (Vercel Marketplace) | Hosted Postgres, free tier |
| ORM | Prisma | Type-safe DB access, easy migrations |
| Auth (admin) | Magic link via email | Nodemailer or Resend — email a one-time login link |
| Email (newsletter) | Resend | Transactional + newsletter sending |
| Deployment | Vercel | Seamless Next.js hosting |

---

## 3. Color Palette

Warm, notebook-like palette — like a well-worn journal with a highlighter.

| Token | Light Mode | Dark Mode | Use |
|---|---|---|---|
| `--bg` | `#FAF8F3` (warm parchment) | `#1C1917` (dark walnut) | Page background |
| `--surface` | `#F0EBE3` (sand) | `#292524` (warm charcoal) | Cards, inputs |
| `--text` | `#2D2A26` (dark brown) | `#F5F0E8` (warm white) | Body text |
| `--text-muted` | `#8C7B6E` (warm grey) | `#A8998C` | Dates, metadata |
| `--accent` | `#D97B4F` (amber orange) | `#E8936A` | Links, buttons, highlights |
| `--accent-subtle` | `#F4DDD0` (blush) | `#3D2B20` | Hover states, tag chips |
| `--border` | `#E2D9CE` | `#3D3530` | Dividers, card borders |

**Typography:**
- Headings: `Lora` (serif — warm, literary feel)
- Body: `Inter` or `DM Sans` (clean, readable)
- Monospace (code blocks): `JetBrains Mono`

---

## 4. Pages & Routes

### 4.1 Home / Landing page (`/`)

**Sections in order:**

1. **Hero** — Blog name, tagline, and a short personal intro (1–2 sentences). Optional: author avatar/photo.
2. **Latest post** — Featured card for the most recent post. Larger than the others, with excerpt visible.
3. **Post grid** — All past posts as cards, newest first. Paginated (8 per page) or infinite scroll.
4. **Newsletter signup** — Inline section near the bottom: "Get new posts in your inbox" + email input + subscribe button.

**Post card shows:**
- Post title
- Week number + date published
- Tags (coloured chips)
- Reading time estimate (e.g. "4 min read")
- First 1–2 sentences as excerpt

---

### 4.2 Individual Post page (`/posts/[slug]`)

- Full article content (rendered Markdown/rich text from DB)
- Header: title, week number, date, reading time, tags
- Author byline with small avatar
- Prev / Next post navigation at the bottom
- **Comments section** — simple threaded comments (name + message, no account required for readers)
- Back to home link

---

### 4.3 About page (`/about`)

- Photo/avatar
- Bio: who you are, what The Learning Lab is, why you write weekly
- Links: GitHub, LinkedIn, Twitter/X, or whatever applies

---

### 4.4 Tag archive page (`/tags/[tag]`)

- Lists all posts with a given tag
- Header shows tag name + post count

---

### 4.5 Search page (`/search`)

- Full-text search across post titles, excerpts, and tags
- Results update as you type (client-side filter or server action)

---

### 4.6 Newsletter unsubscribe (`/unsubscribe`)

- Simple page to confirm unsubscription via token in URL

---

## 5. Admin Panel (`/admin`)

Password-protected area for writing and managing posts. Only accessible by you.

### Auth flow
1. Visit `/admin`
2. Enter email → receive magic link
3. Click link → set a session cookie → redirected to admin dashboard
4. Session expires after 7 days

### Admin pages

| Route | Purpose |
|---|---|
| `/admin` | Dashboard — recent posts, quick stats |
| `/admin/posts` | List all posts with edit/delete |
| `/admin/posts/new` | Create a new post |
| `/admin/posts/[id]/edit` | Edit an existing post |
| `/admin/newsletter` | View subscribers list, send newsletter blast |
| `/admin/comments` | Moderate / delete comments |

### Post editor fields

| Field | Type | Notes |
|---|---|---|
| Title | Text | Required |
| Slug | Text | Auto-generated from title, editable |
| Week number | Number | e.g. `12` — shown as "Week 12" |
| Published date | Date picker | Defaults to today |
| Tags | Multi-tag input | Free-form, comma-separated |
| Cover image | URL or file upload | Optional |
| Content | Rich text editor (Tiptap) | Markdown-friendly, supports code blocks |
| Excerpt | Textarea | Auto-generated from first paragraph if blank |
| Status | Draft / Published | Only published posts appear on the site |

---

## 6. Database Schema (Prisma)

```prisma
model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  weekNumber  Int
  excerpt     String?
  content     String    // HTML or Markdown
  coverImage  String?
  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  tags        Tag[]
  comments    Comment[]
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  name      String
  message   String
  createdAt DateTime @default(now())
  approved  Boolean  @default(true)
}

model Subscriber {
  id          String   @id @default(cuid())
  email       String   @unique
  confirmedAt DateTime?
  createdAt   DateTime @default(now())
  token       String   @unique // unsubscribe token
}

model AdminSession {
  id        String   @id @default(cuid())
  token     String   @unique
  email     String
  expiresAt DateTime
  createdAt DateTime @default(now())
}

enum PostStatus {
  DRAFT
  PUBLISHED
}
```

---

## 7. Features Summary

| Feature | Included | Notes |
|---|---|---|
| Responsive design | Yes | Mobile-first, tested on mobile / tablet / desktop |
| Dark mode toggle | Yes | Persisted in `localStorage`, respects OS preference on first visit |
| Tags & filtering | Yes | Click a tag to see all posts with that tag |
| Search | Yes | Searches title + excerpt + tags |
| Reading time estimate | Yes | Calculated from word count (~200 wpm) |
| Newsletter signup | Yes | Email stored in DB, sent via Resend |
| Comments | Yes | Name + message, no login required, moderated via admin |
| Admin panel | Yes | Magic link auth, rich-text post editor |
| Draft/publish workflow | Yes | Posts only visible on site when status = PUBLISHED |
| Pagination | Yes | 8 posts per page on home and tag pages |
| SEO | Yes | `<title>`, Open Graph tags, sitemap, robots.txt |
| Prev/next navigation | Yes | On individual post pages |

---

## 8. Design Principles

- **Warm first:** Every screen should feel like an invitation, not a dashboard.
- **Reading-optimized:** Post content uses ~65 character line lengths, generous line-height (1.8), comfortable font size (18px body).
- **Low friction publishing:** Writing a post should take under 2 minutes of setup — open admin, write, hit publish.
- **No clutter:** Navigation is minimal. No sidebars on the post page. Content is king.

---

## 9. Navigation

```
[The Learning Lab]          [About]  [Search]  [🌙]
```

- Logo/name links to home
- About links to `/about`
- Search icon links to `/search`
- Moon/sun icon toggles dark mode
- No hamburger menu on desktop — fits on one line
- On mobile: logo + icons only, about collapses into a minimal menu

---

## 10. Out of Scope (v1)

- RSS feed (easy to add later)
- Post analytics / view counts
- Social sharing buttons
- Multiple authors
- Image uploads to cloud storage (use image URLs for now)

---

## 11. Deployment

- Host: **Vercel**
- Database: **Neon Postgres** (provisioned via Vercel Marketplace)
- Email: **Resend** (magic links + newsletter)
- Environment variables needed:
  - `DATABASE_URL` — Neon connection string
  - `RESEND_API_KEY` — for sending emails
  - `ADMIN_EMAIL` — your email address (only this email can request a magic link)
  - `NEXTAUTH_SECRET` or `SESSION_SECRET` — for signing session tokens
  - `NEXT_PUBLIC_SITE_URL` — e.g. `https://thelearninglab.vercel.app`
