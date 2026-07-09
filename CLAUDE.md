# Willian Batista — Portfolio Website Instructions

## What this project is
A personal portfolio website for Willian Batista, a Fullstack Developer based in
Fortaleza, CE, Brazil. The site has two parts:
1. **Public portfolio** — dark, modern, professional. Shows projects, experience, skills.
2. **Admin panel at /admin** — password-protected. Allows updating projects and
   uploading a new resume PDF without touching code.

## Architecture
- **Frontend + Admin:** Next.js 15 App Router
- **Database:** Supabase (PostgreSQL) — stores projects data
- **File storage:** Supabase Storage — stores the resume PDF
- **Auth:** Single admin password stored in environment variable (no user table needed)
- **Deploy:** Vercel

## Tech stack — use exactly these
- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- Framer Motion for animations (subtle, not flashy)
- shadcn/ui for UI primitives (dialog, input, button, card, toast)
- Prisma ORM with Supabase PostgreSQL
- @supabase/supabase-js for Storage (resume PDF upload/download)
- NO NextAuth — admin auth is a simple password check via a Server Action
- Deploy: Vercel

## Design language (public site)
- **Background:** #0a0a0a (near black)
- **Surface:** #111111 and #1a1a1a for cards
- **Primary accent:** #6366f1 (indigo)
- **Text primary:** #f5f5f5
- **Text secondary:** #a3a3a3
- **Border:** #262626
- **Font:** Inter (next/font)
- **Border radius:** 12px for cards, 8px for tags
- Card hover: faint indigo glow (box-shadow: 0 0 0 1px #6366f120, 0 8px 32px #6366f110)
- No gradients — flat and clean
- Accent used sparingly: CTAs, active states, 1-2 hero elements

## Folder structure

```
portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    ← public portfolio (single page)
│   ├── admin/
│   │   ├── page.tsx                ← login page (password form)
│   │   └── dashboard/
│   │       └── page.tsx            ← admin dashboard (projects + resume)
│   └── api/
│       ├── admin/
│       │   └── auth/route.ts       ← POST: verify password, set cookie
│       ├── projects/
│       │   ├── route.ts            ← GET all, POST new
│       │   └── [id]/route.ts       ← PUT update, DELETE
│       └── resume/
│           └── route.ts            ← POST: upload PDF to Supabase Storage
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   └── Contact.tsx
│   ├── admin/
│   │   ├── ProjectForm.tsx         ← create/edit project form
│   │   ├── ProjectList.tsx         ← list with edit/delete buttons
│   │   └── ResumeUpload.tsx        ← drag-and-drop PDF upload
│   └── ui/
│       ├── Navbar.tsx
│       ├── ProjectCard.tsx
│       ├── TechBadge.tsx
│       ├── SectionTitle.tsx
│       └── Footer.tsx
├── lib/
│   ├── db.ts                       ← Prisma singleton
│   ├── supabase.ts                 ← Supabase client for Storage
│   ├── admin-auth.ts               ← cookie-based admin session helpers
│   └── static-data.ts             ← experience + skills (never changes often)
├── prisma/
│   └── schema.prisma
├── middleware.ts                   ← protect /admin/dashboard
├── .env.local
└── CLAUDE.md
```

## Database schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Project {
  id          String   @id @default(cuid())
  name        String
  tagline     String
  description String
  stack       String[] // array of strings
  liveUrl     String?
  githubUrl   String?
  imageUrl    String?  // public URL of screenshot stored in Supabase Storage
  isPrivate   Boolean  @default(false)
  isFeatured  Boolean  @default(true)
  order       Int      @default(0) // display order
  highlights  String[] // bullet points
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Supabase Storage buckets
Create two public buckets in Supabase Storage:
1. `resume` — stores the PDF. Always use the same filename: `curriculo.pdf`
   so the public URL never changes when a new version is uploaded.
2. `project-images` — stores project screenshots uploaded via admin.

Public URL format:
```
https://<project-ref>.supabase.co/storage/v1/object/public/resume/curriculo.pdf
https://<project-ref>.supabase.co/storage/v1/object/public/project-images/<filename>
```

## Environment variables (.env.local)
```
DATABASE_URL="postgresql://..."           # Supabase transaction pooler (port 6543)
DIRECT_URL="postgresql://..."            # Supabase direct (for migrations only)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."          # for server-side storage uploads
ADMIN_PASSWORD="choose-a-strong-password" # the only admin credential
ADMIN_COOKIE_SECRET="random-32-char-string" # for signing the session cookie
```

## Admin authentication (simple, no user table)

```typescript
// lib/admin-auth.ts
// On login: compare submitted password with ADMIN_PASSWORD env var
// If match: set a signed httpOnly cookie "admin_session" = "authenticated"
// Middleware checks for this cookie on /admin/dashboard routes
// No JWT, no NextAuth, no database — just a cookie

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === process.env.ADMIN_PASSWORD
}
```

```typescript
// middleware.ts
// Protect /admin/dashboard/* — redirect to /admin if no valid cookie
// Public routes: /, /admin (login page), /api/* (some public)
```

## Admin dashboard features

### Projects management
- List of all projects with drag-to-reorder (updates `order` field)
- "New project" button → opens ProjectForm in a Dialog
- Each project row has Edit and Delete buttons
- ProjectForm fields:
  - Name (text)
  - Tagline (text)
  - Description (textarea)
  - Stack (comma-separated tags input, displayed as removable pills)
  - Live URL (text, optional)
  - GitHub URL (text, optional)
  - Screenshot (file upload → goes to Supabase Storage `project-images` bucket)
  - Is Private? (toggle — hides GitHub link on public site)
  - Is Featured? (toggle — shows in main grid vs smaller card)
  - Highlights (dynamic list — add/remove bullet points)
  - Display order (number)

### Resume management
- Shows current resume info: filename, upload date, file size
- "Download current" button to preview
- Drag-and-drop upload area (PDF only, max 5MB)
- On upload: replaces `curriculo.pdf` in the `resume` Supabase Storage bucket
- Upload uses the Supabase service role key (server-side only, never exposed)

## Public site — how it fetches data

Projects come from the database (Prisma), not from a static file.
Experience and skills come from `lib/static-data.ts` (they rarely change).
Resume download button points to the Supabase Storage public URL directly.

```typescript
// app/page.tsx — Server Component
const projects = await prisma.project.findMany({
  orderBy: { order: 'asc' }
})
// pass to Projects section component
```

## Resume download button (public site)
```typescript
// In Contact section or Hero section
const RESUME_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resume/curriculo.pdf`

<a href={RESUME_URL} download="Willian_Batista_CV.pdf">
  Baixar currículo
</a>
```

---

## Static content (lib/static-data.ts)

### Personal info
```typescript
export const personal = {
  name: "Willian Batista",
  role: "Desenvolvedor Fullstack",
  location: "Fortaleza, CE",
  email: "willianmoreira.2000.19@gmail.com",
  github: "https://github.com/WillianBatista19",
  linkedin: "https://linkedin.com/in/willianbatistadev",
  bio: "Desenvolvedor Fullstack com experiência em sistemas empresariais complexos, SaaS e aplicações em tempo real. Especialista em React, Next.js e TypeScript, com vivência em arquiteturas feature-based, integrações REST e deploy em produção."
}
```

### Experience (static — edit in code when needed)
```typescript
export const experience = [
  {
    company: "Ivory.",
    role: "Desenvolvedor Front-End",
    period: "08/2025 – 06/2026",
    type: "Remoto",
    stack: ["React 19", "TypeScript 5.6", "Vite 6", "Tailwind CSS", "Jotai", "Jest", "SonarQube"],
    highlights: [
      "ERP web para empresa de sondagem geológica com módulos complexos",
      "Arquitetura feature-based com Jotai, React Hook Form e roteamento lazy-loaded",
      "Integração REST com Axios + interceptors JWT e controle de permissões por rota",
      "Testes com Jest e React Testing Library; análise de qualidade via SonarQube"
    ]
  },
  {
    company: "Teia Studios",
    role: "Desenvolvedor Front-End (Estágio)",
    period: "10/2023 – 08/2025",
    type: "Híbrido",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Prisma"],
    highlights: [
      "Desenvolvimento de sites comerciais e landing pages",
      "Studio Mavi: plataforma com autenticação e persistência via MongoDB",
      "Membro fundador — estruturou os processos de dev desde o início da empresa"
    ]
  },
  {
    company: "Freelancer",
    role: "Desenvolvedor Web",
    period: "02/2019 – 10/2023",
    type: "Remoto",
    stack: ["React", "WordPress", "Shopify", "WooCommerce", "HTML", "CSS", "JavaScript"],
    highlights: [
      "Sites institucionais, landing pages e e-commerces para clientes diversos",
      "E-commerces com Shopify e WooCommerce com integração de pagamentos",
      "Atendimento end-to-end: requisitos → desenvolvimento → SEO → manutenção"
    ]
  }
]
```

### Skills
```typescript
export const skills = {
  "Front-End": ["React 19", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Framer Motion", "React Native"],
  "Back-End": ["Node.js", "Laravel", "Prisma", "PostgreSQL", "MongoDB", "REST APIs"],
  "Ferramentas": ["Git", "Docker", "Vercel", "Supabase", "Jest", "SonarQube", "Claude Code"],
  "Libs & Patterns": ["Jotai", "TanStack Query", "React Hook Form", "Zod", "Axios", "Vite"]
}
```

### Initial projects seed (prisma/seed.ts)
Seed these 4 projects into the database on first setup:
1. InsightHub — featured, order 1, not private
   liveUrl: https://insighthub-umber.vercel.app
   githubUrl: https://github.com/WillianBatista19/insighthub
   stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma", "NextAuth", "Recharts", "Supabase", "Vercel"]
   highlights: ["Tracker JS próprio com auto-detecção de origem", "Rate limiting e limite de plano FREE na API", "CI/CD com GitHub Actions + deploy automático na Vercel", "Queries otimizadas com índices compostos para série temporal"]

2. Zapli — featured, order 2, not private
   liveUrl: https://zapli-app.vercel.app
   githubUrl: https://github.com/WillianBatista19/zapli
   stack: ["Next.js 14", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS"]
   highlights: ["Feed e mensagens em tempo real com Supabase Realtime", "4 integrações externas: Spotify, TMDB, AniList, Google Books", "Autenticação completa com controle de perfis"]

3. ITSM Lite — featured, order 3, not private
   liveUrl: https://itsm-lite-nyql.vercel.app
   githubUrl: https://github.com/WillianBatista19/itsm-lite
   stack: ["Next.js 14", "TypeScript", "Laravel 12", "PostgreSQL", "TanStack Query", "Docker"]
   highlights: ["Stack separada: Next.js (frontend) + Laravel (API REST)", "Controle de acesso por 3 perfis com permissões distintas", "Docker para ambiente de desenvolvimento padronizado"]

4. Marginalia — NOT featured, order 4, isPrivate: true
   liveUrl: null, githubUrl: null
   stack: ["Next.js", "TypeScript", "Tailwind CSS"]
   highlights: ["Projeto pessoal com código privado", "Foco em experiência de escrita e organização"]

---

## Coding rules
- TypeScript strict, no `any`
- Server Components by default — 'use client' only for Framer Motion and interactive elements
- Admin routes always verify the session cookie before doing anything
- Never expose SUPABASE_SERVICE_ROLE_KEY to the client — only use in API routes
- NEXT_PUBLIC_* vars are safe to expose (anon key, supabase URL)
- Mobile-first responsive design
- All images via next/image with alt text

## How to initialize
```bash
npx create-next-app@latest portfolio --typescript --tailwind --app --no-src-dir
cd portfolio
npm install framer-motion @supabase/supabase-js prisma @prisma/client
npm install -D @types/node
npx shadcn@latest init
npx shadcn@latest add button card input label textarea dialog toast badge
npx prisma init
```

---

## EXECUTION PLAN

Execute one step at a time when asked.
Confirm before starting. List files created/modified after each step.

### STEP 1 — Setup and database
- Initialize project, install all dependencies
- Create prisma/schema.prisma with Project model
- Create .env.local and .env.example
- Run: npx prisma migrate dev --name init
- Create prisma/seed.ts with the 4 projects above
- Run: npx prisma db seed
- Create lib/db.ts (Prisma singleton)
- Create lib/supabase.ts (Supabase client — two exports: one with anon key for client, one with service role for server)
- Create lib/static-data.ts with personal, experience, skills

### STEP 2 — Admin auth
- Create lib/admin-auth.ts with verifyAdminPassword and session cookie helpers
- Create app/api/admin/auth/route.ts (POST: verify password → set cookie → return ok)
- Create middleware.ts: protect /admin/dashboard, redirect to /admin if no cookie
- Create app/admin/page.tsx: simple centered login form (password input + submit)
  - On submit: POST to /api/admin/auth, redirect to /admin/dashboard on success
  - Dark design matching portfolio

### STEP 3 — Admin dashboard: projects
- Create app/api/projects/route.ts (GET all ordered by `order`, POST new)
- Create app/api/projects/[id]/route.ts (PUT update, DELETE)
- Create components/admin/ProjectForm.tsx (full form in a shadcn Dialog)
- Create components/admin/ProjectList.tsx (table with edit/delete actions)
- Create app/admin/dashboard/page.tsx with projects tab

### STEP 4 — Admin dashboard: resume
- Create app/api/resume/route.ts (POST: receives PDF, uploads to Supabase Storage `resume` bucket as `curriculo.pdf`, upsert/replace)
- Create components/admin/ResumeUpload.tsx (drag-and-drop, PDF only, 5MB max, shows current file info)
- Add resume tab to app/admin/dashboard/page.tsx

### STEP 5 — Shared UI components
- Create components/ui/SectionTitle.tsx
- Create components/ui/TechBadge.tsx
- Create components/ui/ProjectCard.tsx (handles featured and private variants)
- Create components/ui/Navbar.tsx (fixed, backdrop-blur, smooth scroll, mobile hamburger)
- Create components/ui/Footer.tsx

### STEP 6 — Hero section
- Create components/sections/Hero.tsx
- Large name, role with blinking cursor, bio, two CTAs (Ver projetos + GitHub)
- Resume download button pointing to Supabase Storage public URL
- Subtle CSS dot background (no canvas, no JS)

### STEP 7 — Projects section
- Create components/sections/Projects.tsx
- Fetch projects from DB in app/page.tsx (Server Component), pass as props
- Featured grid (3 columns desktop, 1 mobile)
- Private project (Marginalia) as smaller card with lock icon, no links

### STEP 8 — Experience, About, Skills, Contact sections
- Create components/sections/About.tsx (bio + 3 stat cards: 5+ anos, 10+ projetos, 3 empresas)
- Create components/sections/Experience.tsx (vertical timeline)
- Create components/sections/Skills.tsx (grouped badges)
- Create components/sections/Contact.tsx (email + LinkedIn buttons, GitHub link)

### STEP 9 — Assembly, animations, polish
- Assemble app/page.tsx: Hero → About → Projects → Experience → Skills → Contact
- Add Framer Motion fade-in-up to all sections (respect prefers-reduced-motion)
- Project cards: scale 1.01 on hover
- Run: npx tsc --noEmit (zero errors)
- Run: npm run build (must pass)
- Test mobile layout in DevTools
- Verify all nav smooth scroll links work

---

## How to talk to Claude Code

```
Read the CLAUDE.md and execute Step [N].
Confirm what you are about to do before starting.
List all files created or modified when done.
```

## After deploy checklist
- [ ] Create `resume` bucket in Supabase Storage (set to public)
- [ ] Create `project-images` bucket in Supabase Storage (set to public)
- [ ] Upload your resume PDF via /admin/dashboard
- [ ] Add project screenshots via admin or directly in Supabase Storage
- [ ] Set all environment variables in Vercel dashboard
- [ ] Test /admin login with ADMIN_PASSWORD
- [ ] Test resume download on public site