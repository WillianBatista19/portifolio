import { ArrowRight, Download } from 'lucide-react'
import { personal } from '@/lib/static-data'
import { GithubIcon } from '@/components/ui/icons'

const RESUME_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resume/curriculo.pdf`

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0a0a0a] px-4 sm:px-8">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(#262626 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="mx-auto w-full max-w-3xl pt-20">
        <p className="text-sm text-[#6366f1]">Olá, eu sou</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#f5f5f5] sm:text-6xl">
          {personal.name}
        </h1>
        <p className="mt-3 flex items-center text-xl text-[#a3a3a3] sm:text-2xl">
          {personal.role}
          <span
            aria-hidden
            className="animate-blink ml-1 inline-block h-[1em] w-[2px] bg-[#6366f1]"
          />
        </p>
        <p className="mt-6 max-w-xl text-[#a3a3a3]">{personal.bio}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#6366f1] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6366f1]/90"
          >
            Ver projetos
            <ArrowRight className="size-4" />
          </a>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#262626] px-4 py-2.5 text-sm font-medium text-[#f5f5f5] transition-colors hover:bg-[#1a1a1a]"
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
          <a
            href={RESUME_URL}
            download="Willian_Batista_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#262626] px-4 py-2.5 text-sm font-medium text-[#f5f5f5] transition-colors hover:bg-[#1a1a1a]"
          >
            <Download className="size-4" />
            Baixar currículo
          </a>
        </div>
      </div>
    </section>
  )
}
