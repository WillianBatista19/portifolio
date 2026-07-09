'use client'

import { useState, type FormEvent, type KeyboardEvent } from 'react'
import type { Project } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'

interface ProjectFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  onSaved: () => void
}

const emptyState = {
  name: '',
  tagline: '',
  description: '',
  liveUrl: '',
  githubUrl: '',
  order: 0,
}

// Remounted by the parent (via `key`) every time it's opened, so form state
// always starts fresh from `project` without needing a reset effect.
export function ProjectForm({ open, onOpenChange, project, onSaved }: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? emptyState.name)
  const [tagline, setTagline] = useState(project?.tagline ?? emptyState.tagline)
  const [description, setDescription] = useState(project?.description ?? emptyState.description)
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? emptyState.liveUrl)
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? emptyState.githubUrl)
  const [order, setOrder] = useState(project?.order ?? emptyState.order)
  const [isPrivate, setIsPrivate] = useState(project?.isPrivate ?? false)
  const [isFeatured, setIsFeatured] = useState(project?.isFeatured ?? true)

  const [stack, setStack] = useState<string[]>(project?.stack ?? [])
  const [stackInput, setStackInput] = useState('')

  const [highlights, setHighlights] = useState<string[]>(project?.highlights ?? [])
  const [highlightInput, setHighlightInput] = useState('')

  const imageUrl = project?.imageUrl ?? ''
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  function addStackTag() {
    const value = stackInput.trim()
    if (value && !stack.includes(value)) {
      setStack([...stack, value])
    }
    setStackInput('')
  }

  function handleStackKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addStackTag()
    }
  }

  function addHighlight() {
    const value = highlightInput.trim()
    if (value) {
      setHighlights([...highlights, value])
    }
    setHighlightInput('')
  }

  function handleHighlightKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      addHighlight()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)
    if (imageFile) setUploading(true)

    try {
      const formData = new FormData()
      formData.set('name', name)
      formData.set('tagline', tagline)
      formData.set('description', description)
      formData.set('stack', JSON.stringify(stack))
      formData.set('liveUrl', liveUrl)
      formData.set('githubUrl', githubUrl)
      formData.set('imageUrl', imageUrl)
      formData.set('isPrivate', String(isPrivate))
      formData.set('isFeatured', String(isFeatured))
      formData.set('order', String(order))
      formData.set('highlights', JSON.stringify(highlights))
      if (imageFile) formData.set('image', imageFile)

      const endpoint = project ? `/api/projects/${project.id}` : '/api/projects'
      const method = project ? 'PUT' : 'POST'

      const response = await fetch(endpoint, { method, body: formData })

      if (!response.ok) throw new Error('Falha ao salvar o projeto.')

      onSaved()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-[#262626] bg-[#111111] text-[#f5f5f5] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#f5f5f5]">
            {project ? 'Editar projeto' : 'Novo projeto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#f5f5f5]">
              Nome
            </Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline" className="text-[#f5f5f5]">
              Tagline
            </Label>
            <Input
              id="tagline"
              required
              value={tagline}
              onChange={(event) => setTagline(event.target.value)}
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#f5f5f5]">
              Descrição
            </Label>
            <Textarea
              id="description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stack" className="text-[#f5f5f5]">
              Stack
            </Label>
            <Input
              id="stack"
              value={stackInput}
              onChange={(event) => setStackInput(event.target.value)}
              onKeyDown={handleStackKeyDown}
              onBlur={addStackTag}
              placeholder="Digite e pressione Enter"
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5]"
            />
            {stack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {stack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="gap-1 border-[#262626] text-[#f5f5f5]"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => setStack(stack.filter((s) => s !== tech))}
                      aria-label={`Remover ${tech}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liveUrl" className="text-[#f5f5f5]">
                Live URL
              </Label>
              <Input
                id="liveUrl"
                type="url"
                value={liveUrl}
                onChange={(event) => setLiveUrl(event.target.value)}
                className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-[#f5f5f5]">
                GitHub URL
              </Label>
              <Input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(event) => setGithubUrl(event.target.value)}
                className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-[#f5f5f5]">
              Screenshot
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5]"
            />
            {imageUrl && !imageFile && (
              <p className="truncate text-xs text-[#a3a3a3]">Atual: {imageUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlights" className="text-[#f5f5f5]">
              Destaques
            </Label>
            <Input
              id="highlights"
              value={highlightInput}
              onChange={(event) => setHighlightInput(event.target.value)}
              onKeyDown={handleHighlightKeyDown}
              placeholder="Digite e pressione Enter"
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5]"
            />
            {highlights.length > 0 && (
              <ul className="space-y-1 pt-1">
                {highlights.map((highlight, index) => (
                  <li
                    key={`${highlight}-${index}`}
                    className="flex items-start justify-between gap-2 rounded-lg border border-[#262626] bg-[#1a1a1a] px-2.5 py-1.5 text-sm text-[#f5f5f5]"
                  >
                    <span>{highlight}</span>
                    <button
                      type="button"
                      onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                      aria-label="Remover destaque"
                    >
                      <X className="size-3.5 shrink-0 text-[#a3a3a3]" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order" className="text-[#f5f5f5]">
              Ordem de exibição
            </Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(event) => setOrder(Number(event.target.value))}
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5]"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#1a1a1a] px-3 py-2.5">
            <Label htmlFor="isPrivate" className="text-[#f5f5f5]">
              Privado (esconde link do GitHub)
            </Label>
            <Switch id="isPrivate" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#1a1a1a] px-3 py-2.5">
            <Label htmlFor="isFeatured" className="text-[#f5f5f5]">
              Destaque (grade principal)
            </Label>
            <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <DialogFooter className="border-[#262626] bg-transparent">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#6366f1] text-white hover:bg-[#6366f1]/90"
            >
              {uploading ? 'Enviando imagem...' : saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
