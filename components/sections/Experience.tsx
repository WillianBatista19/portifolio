import { SectionTitle } from '@/components/ui/SectionTitle'
import { TechBadge } from '@/components/ui/TechBadge'
import { experience } from '@/lib/static-data'

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 bg-[#0a0a0a] px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionTitle title="Experiência" />

        <div className="space-y-10 border-l border-[#262626] pl-6">
          {experience.map((job) => (
            <div key={job.company} className="relative">
              <span className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-[#6366f1]" />

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-medium text-[#f5f5f5]">
                  {job.role} · {job.company}
                </h3>
                <span className="text-xs text-[#a3a3a3]">
                  {job.period} · {job.type}
                </span>
              </div>

              <ul className="mt-3 space-y-1.5">
                {job.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2 text-sm text-[#a3a3a3]">
                    <span className="text-[#6366f1]">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.stack.map((tech) => (
                  <TechBadge key={tech}>{tech}</TechBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
