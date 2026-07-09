'use client'

import { useState, type DragEvent } from 'react'
import type { Project } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'

interface ProjectListProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onChanged: () => void
}

export function ProjectList({ projects, onEdit, onChanged }: ProjectListProps) {
  const [items, setItems] = useState(projects)
  const [prevProjects, setPrevProjects] = useState(projects)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Re-sync local (draggable) copy when the server-provided list changes,
  // without an effect — see https://react.dev/learn/you-might-not-need-an-effect
  if (projects !== prevProjects) {
    setPrevProjects(projects)
    setItems(projects)
  }

  function handleDragStart(index: number) {
    setDragIndex(index)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>, index: number) {
    event.preventDefault()
    if (dragIndex === null || dragIndex === index) return

    const reordered = [...items]
    const [dragged] = reordered.splice(dragIndex, 1)
    reordered.splice(index, 0, dragged)
    setDragIndex(index)
    setItems(reordered)
  }

  async function handleDrop() {
    setDragIndex(null)

    const changed = items
      .map((item, index) => ({ item, order: index }))
      .filter(({ item, order }) => item.order !== order)

    if (changed.length === 0) return

    await Promise.all(
      changed.map(({ item, order }) => {
        const formData = new FormData()
        formData.set('name', item.name)
        formData.set('tagline', item.tagline)
        formData.set('description', item.description)
        formData.set('stack', JSON.stringify(item.stack))
        formData.set('liveUrl', item.liveUrl ?? '')
        formData.set('githubUrl', item.githubUrl ?? '')
        formData.set('imageUrl', item.imageUrl ?? '')
        formData.set('isPrivate', String(item.isPrivate))
        formData.set('isFeatured', String(item.isFeatured))
        formData.set('order', String(order))
        formData.set('highlights', JSON.stringify(item.highlights))

        return fetch(`/api/projects/${item.id}`, { method: 'PUT', body: formData })
      })
    )

    onChanged()
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este projeto?')) return

    setDeletingId(id)
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    onChanged()
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-[#262626] bg-[#111111] px-4 py-8 text-center text-sm text-[#a3a3a3]">
        Nenhum projeto cadastrado ainda.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((project, index) => (
        <div
          key={project.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(event) => handleDragOver(event, index)}
          onDrop={handleDrop}
          className="flex flex-wrap items-center gap-3 rounded-xl border border-[#262626] bg-[#111111] px-4 py-3"
        >
          <GripVertical className="size-4 shrink-0 cursor-grab text-[#a3a3a3]" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-[#f5f5f5]">{project.name}</span>
              {project.isFeatured && (
                <Badge variant="outline" className="border-[#262626] text-[#a3a3a3]">
                  Destaque
                </Badge>
              )}
              {project.isPrivate && (
                <Badge variant="outline" className="border-[#262626] text-[#a3a3a3]">
                  Privado
                </Badge>
              )}
            </div>
            <p className="truncate text-sm text-[#a3a3a3]">{project.tagline}</p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5] hover:bg-[#262626] hover:text-[#f5f5f5]"
              onClick={() => onEdit(project)}
              aria-label={`Editar ${project.name}`}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5] hover:bg-[#262626] hover:text-[#f5f5f5]"
              disabled={deletingId === project.id}
              onClick={() => handleDelete(project.id)}
              aria-label={`Excluir ${project.name}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
