import { prisma } from '@/lib/db'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { FadeIn } from '@/components/ui/FadeIn'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Projects } from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/sections/Contact'

// Re-fetch at most once a minute so admin edits show up without a redeploy.
export const revalidate = 60

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FadeIn>
          <Hero />
        </FadeIn>
        <FadeIn>
          <About />
        </FadeIn>
        <FadeIn>
          <Projects projects={projects} />
        </FadeIn>
        <FadeIn>
          <Experience />
        </FadeIn>
        <FadeIn>
          <Skills />
        </FadeIn>
        <FadeIn>
          <Contact />
        </FadeIn>
      </main>
      <Footer />
    </>
  )
}
