'use client'

import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud, FileText, Download } from 'lucide-react'

interface ResumeInfo {
  exists: boolean
  name?: string
  size?: number | null
  updatedAt?: string
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024

const RESUME_PUBLIC_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resume/curriculo.pdf`

function formatSize(bytes: number | null | undefined) {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

function formatDate(iso: string | undefined) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('pt-BR')
}

export function ResumeUpload() {
  const [info, setInfo] = useState<ResumeInfo | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchInfo = useCallback(async () => {
    const response = await fetch('/api/resume')
    const data = await response.json()
    setInfo(data)
  }, [])

  useEffect(() => {
    let ignore = false

    fetch('/api/resume')
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) setInfo(data)
      })

    return () => {
      ignore = true
    }
  }, [])

  async function uploadFile(file: File) {
    setError('')

    if (file.type !== 'application/pdf') {
      setError('O arquivo precisa ser um PDF.')
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError('O arquivo deve ter no máximo 5MB.')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.set('file', file)

      const response = await fetch('/api/resume', { method: 'POST', body: formData })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error ?? 'Falha ao enviar o currículo.')

      await fetchInfo()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center transition-colors ${
          isDragging ? 'border-[#6366f1] bg-[#6366f1]/5' : 'border-[#262626] bg-[#111111]'
        }`}
      >
        <UploadCloud className="size-6 text-[#a3a3a3]" />
        <p className="text-sm text-[#f5f5f5]">
          Arraste um PDF aqui ou clique para selecionar
        </p>
        <p className="text-xs text-[#a3a3a3]">PDF, até 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) uploadFile(file)
            event.target.value = ''
          }}
        />
      </div>

      {uploading && <p className="text-sm text-[#a3a3a3]">Enviando...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="rounded-xl border border-[#262626] bg-[#111111] px-4 py-3">
        {info === null ? (
          <p className="text-sm text-[#a3a3a3]">Carregando...</p>
        ) : info.exists ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-[#f5f5f5]">
              <FileText className="size-4 shrink-0 text-[#a3a3a3]" />
              <div>
                <p>{info.name}</p>
                <p className="text-xs text-[#a3a3a3]">
                  {formatSize(info.size)} · atualizado em {formatDate(info.updatedAt)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 border-[#262626] bg-[#1a1a1a] text-[#f5f5f5] hover:bg-[#262626] hover:text-[#f5f5f5]"
              onClick={() => window.open(RESUME_PUBLIC_URL, '_blank', 'noopener,noreferrer')}
            >
              <Download className="size-3.5" />
              Baixar atual
            </Button>
          </div>
        ) : (
          <p className="text-sm text-[#a3a3a3]">Nenhum currículo enviado ainda.</p>
        )}
      </div>
    </div>
  )
}
