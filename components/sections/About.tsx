import { SectionTitle } from '@/components/ui/SectionTitle'
import { personal } from '@/lib/static-data'

const stats = [
  { value: '5+', label: 'anos de experiência' },
  { value: '10+', label: 'projetos entregues' },
  { value: '3', label: 'empresas' },
]

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-[#0a0a0a] px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionTitle title="Sobre mim" />

        <p className="text-center text-[#a3a3a3]">{personal.bio}</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[12px] border border-[#262626] bg-[#111111] px-6 py-6 text-center"
            >
              <p className="text-3xl font-semibold text-[#6366f1]">{stat.value}</p>
              <p className="mt-1 text-sm text-[#a3a3a3]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
