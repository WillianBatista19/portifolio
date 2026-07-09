import { personal } from '@/lib/static-data'

export function Footer() {
  return (
    <footer className="border-t border-[#262626] bg-[#0a0a0a] px-4 py-8 sm:px-8">
      <p className="text-center text-sm text-[#a3a3a3]">
        © {new Date().getFullYear()} {personal.name}. Todos os direitos reservados.
      </p>
    </footer>
  )
}
