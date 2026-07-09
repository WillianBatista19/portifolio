import { Mail } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { personal } from '@/lib/static-data'
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons'

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-[#0a0a0a] px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-xl text-center">
        <SectionTitle title="Contato" subtitle="Vamos conversar sobre seu próximo projeto" />

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${personal.email}`}
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#6366f1] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6366f1]/90"
          >
            <Mail className="size-4" />
            Enviar email
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#262626] px-4 py-2.5 text-sm font-medium text-[#f5f5f5] transition-colors hover:bg-[#1a1a1a]"
          >
            <LinkedinIcon className="size-4" />
            LinkedIn
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
        </div>
      </div>
    </section>
  )
}
