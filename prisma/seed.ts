import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const projects = [
  {
    name: "InsightHub",
    tagline: "Plataforma de analytics para sites com tracker próprio",
    description: "SaaS de analytics web com tracker JavaScript próprio, dashboards em tempo real e controle de limites por plano.",
    isFeatured: true,
    isPrivate: false,
    order: 1,
    liveUrl: "https://insighthub-umber.vercel.app",
    githubUrl: "https://github.com/WillianBatista19/insighthub",
    stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma", "NextAuth", "Recharts", "Supabase", "Vercel"],
    highlights: [
      "Tracker JS próprio com auto-detecção de origem",
      "Rate limiting e limite de plano FREE na API",
      "CI/CD com GitHub Actions + deploy automático na Vercel",
      "Queries otimizadas com índices compostos para série temporal"
    ]
  },
  {
    name: "Zapli",
    tagline: "Rede social com feed, mensagens e integrações externas",
    description: "Aplicação social com feed e mensagens em tempo real, autenticação completa e integrações com Spotify, TMDB, AniList e Google Books.",
    isFeatured: true,
    isPrivate: false,
    order: 2,
    liveUrl: "https://zapli-app.vercel.app",
    githubUrl: "https://github.com/WillianBatista19/zapli",
    stack: ["Next.js 14", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS"],
    highlights: [
      "Feed e mensagens em tempo real com Supabase Realtime",
      "4 integrações externas: Spotify, TMDB, AniList, Google Books",
      "Autenticação completa com controle de perfis"
    ]
  },
  {
    name: "ITSM Lite",
    tagline: "Sistema de gestão de chamados com controle de acesso",
    description: "Sistema de ITSM com frontend em Next.js e API própria em Laravel, controle de acesso por perfis e ambiente Dockerizado.",
    isFeatured: true,
    isPrivate: false,
    order: 3,
    liveUrl: "https://itsm-lite-nyql.vercel.app",
    githubUrl: "https://github.com/WillianBatista19/itsm-lite",
    stack: ["Next.js 14", "TypeScript", "Laravel 12", "PostgreSQL", "TanStack Query", "Docker"],
    highlights: [
      "Stack separada: Next.js (frontend) + Laravel (API REST)",
      "Controle de acesso por 3 perfis com permissões distintas",
      "Docker para ambiente de desenvolvimento padronizado"
    ]
  },
  {
    name: "Marginalia",
    tagline: "Rede social para leitores, no estilo Goodreads/Skoob/StoryGraph",
    description: "Rede social para leitores desenvolvida do zero, combinando o melhor do Goodreads, Skoob e StoryGraph. Catálogo próprio com importação automática via Open Library e Google Books, estante pessoal, resenhas, sistema de seguir usuários, feed de atividades, tracker de leitura com cards compartilháveis, estatísticas anuais e metas de leitura.",
    isFeatured: false,
    isPrivate: true,
    order: 4,
    liveUrl: "https://marginalia-app-official.vercel.app/",
    githubUrl: null,
    stack: ["Next.js 15", "TypeScript", "Supabase", "PostgreSQL", "Prisma", "Tailwind CSS", "shadcn/ui", "TanStack Query", "React Hook Form", "Zod", "Vercel"],
    highlights: [
      "Catálogo próprio com importação automática via Open Library e Google Books",
      "Feed social em tempo real com atividades de usuários seguidos",
      "Tracker de leitura com cards compartilháveis para Stories/WhatsApp",
      "Importação e exportação compatível com CSV do Goodreads"
    ]
  }
]

async function main() {
  for (const project of projects) {
    await prisma.project.create({ data: project })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
