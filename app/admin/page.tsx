'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const response = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      router.push('/admin/dashboard')
      return
    }

    setIsSubmitting(false)
    setError('Senha incorreta.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#262626] bg-[#111111] p-8">
        <h1 className="text-xl font-semibold text-[#f5f5f5]">Admin</h1>
        <p className="mt-1 text-sm text-[#a3a3a3]">Entre com a senha para continuar.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#f5f5f5]">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              autoFocus
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border-[#262626] bg-[#1a1a1a] text-[#f5f5f5] placeholder:text-[#a3a3a3] focus-visible:border-[#6366f1] focus-visible:ring-[#6366f1]/50"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#6366f1] text-white hover:bg-[#6366f1]/90"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </main>
  )
}
