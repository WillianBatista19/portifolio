interface SectionTitleProps {
  title: string
  subtitle?: string
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-10 text-center sm:mb-14">
      <h2 className="text-2xl font-semibold text-[#f5f5f5] sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-md text-sm text-[#a3a3a3] sm:text-base">{subtitle}</p>
      )}
      <div className="mx-auto mt-4 h-px w-10 bg-[#6366f1]" />
    </div>
  )
}
