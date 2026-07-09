'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { personal } from '@/lib/static-data'

const links = [
  { href: '#about', label: 'Sobre' },
  { href: '#projects', label: 'Projetos' },
  { href: '#experience', label: 'Experiência' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contato' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
        <a href="#" className="text-sm font-medium text-[#f5f5f5]">
          {personal.name}
        </a>

        <ul className="hidden gap-6 sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-[#a3a3a3] transition-colors hover:text-[#f5f5f5]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="text-[#f5f5f5] sm:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-[#262626] bg-[#0a0a0a] px-4 py-3 sm:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-[#a3a3a3] hover:text-[#f5f5f5]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
