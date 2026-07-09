interface TechBadgeProps {
  children: React.ReactNode
}

export function TechBadge({ children }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-[8px] border border-[#262626] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-[#a3a3a3]">
      {children}
    </span>
  )
}
