import { SectionTitle } from '@/components/ui/SectionTitle'
import { TechBadge } from '@/components/ui/TechBadge'
import { skills } from '@/lib/static-data'

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 bg-[#0a0a0a] px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionTitle title="Skills" />

        <div className="space-y-6">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-[#f5f5f5]">{category}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((skill) => (
                  <TechBadge key={skill}>{skill}</TechBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
