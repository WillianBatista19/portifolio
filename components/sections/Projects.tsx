import type { Project } from '@prisma/client'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProjectCard } from '@/components/ui/ProjectCard'

interface ProjectsProps {
  projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
  const featured = projects.filter((project) => project.isFeatured)
  const others = projects.filter((project) => !project.isFeatured)

  return (
    <section id="projects" className="scroll-mt-24 bg-[#0a0a0a] px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionTitle title="Projetos" subtitle="Alguns dos projetos que desenvolvi" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {others.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
