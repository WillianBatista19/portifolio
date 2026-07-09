import Image from 'next/image'
import { ExternalLink, Lock } from 'lucide-react'
import type { Project } from '@prisma/client'
import { TechBadge } from '@/components/ui/TechBadge'
import { GithubIcon } from '@/components/ui/icons'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  if (project.isPrivate) {
    return (
      <div className="overflow-hidden rounded-[12px] border border-[#262626] bg-[#111111] transition-transform duration-200 hover:scale-[1.01]">
        <div className="p-5">
          <h3 className="font-medium text-[#f5f5f5]">{project.name}</h3>
          <p className="mt-1 text-sm text-[#a3a3a3]">{project.tagline}</p>

          {project.description && (
            <p className="mt-3 text-sm text-[#a3a3a3]">{project.description}</p>
          )}

          {project.highlights.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {project.highlights.slice(0, 3).map((highlight) => (
                <li key={highlight} className="flex gap-2 text-sm text-[#a3a3a3]">
                  <span className="text-[#6366f1]">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          {project.stack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <TechBadge key={tech}>{tech}</TechBadge>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[#262626] pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#f5f5f5] transition-colors hover:text-[#6366f1]"
              >
                Ver projeto ao vivo ↗
              </a>
            )}
            <span className="inline-flex items-center gap-1.5 text-sm text-[#a3a3a3]">
              <Lock className="size-3.5" />
              Repositório privado
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group overflow-hidden rounded-[12px] border border-[#262626] bg-[#111111] transition-[transform,box-shadow] duration-200 hover:scale-[1.01] hover:shadow-[0_0_0_1px_#6366f120,0_8px_32px_#6366f110]">
      {project.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-[#262626] bg-[#1a1a1a]">
          <Image
            src={project.imageUrl}
            alt={`Captura de tela do projeto ${project.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="p-5">
        <h3 className="font-medium text-[#f5f5f5]">{project.name}</h3>
        <p className="mt-1 text-sm text-[#a3a3a3]">{project.tagline}</p>

        {project.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2 text-sm text-[#a3a3a3]">
                <span className="text-[#6366f1]">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {project.stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <div className="mt-5 flex gap-4 border-t border-[#262626] pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#f5f5f5] transition-colors hover:text-[#6366f1]"
              >
                <ExternalLink className="size-3.5" />
                Ver projeto
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#f5f5f5] transition-colors hover:text-[#6366f1]"
              >
                <GithubIcon className="size-3.5" />
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
