'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Project } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ProjectList } from '@/components/admin/ProjectList'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { ResumeUpload } from '@/components/admin/ResumeUpload'
import { Plus } from 'lucide-react'

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formKey, setFormKey] = useState(0)

  const fetchProjects = useCallback(async () => {
    const response = await fetch('/api/projects')
    const data = await response.json()
    setProjects(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false

    fetch('/api/projects')
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) {
          setProjects(data)
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  function handleNewProject() {
    setEditingProject(null)
    setFormKey((key) => key + 1)
    setFormOpen(true)
  }

  function handleEditProject(project: Project) {
    setEditingProject(project)
    setFormKey((key) => key + 1)
    setFormOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-xl font-semibold text-[#f5f5f5]">Dashboard</h1>

        <Tabs defaultValue="projects" className="mt-6">
          <TabsList className="border border-[#262626] bg-[#111111]">
            <TabsTrigger
              value="projects"
              className="text-[#a3a3a3] hover:text-[#f5f5f5] data-active:bg-[#1a1a1a] data-active:text-[#f5f5f5]"
            >
              Projetos
            </TabsTrigger>
            <TabsTrigger
              value="resume"
              className="text-[#a3a3a3] hover:text-[#f5f5f5] data-active:bg-[#1a1a1a] data-active:text-[#f5f5f5]"
            >
              Currículo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleNewProject}
                className="gap-1.5 bg-[#6366f1] text-white hover:bg-[#6366f1]/90"
              >
                <Plus className="size-4" />
                Novo projeto
              </Button>
            </div>

            {loading ? (
              <p className="text-sm text-[#a3a3a3]">Carregando...</p>
            ) : (
              <ProjectList
                projects={projects}
                onEdit={handleEditProject}
                onChanged={fetchProjects}
              />
            )}
          </TabsContent>

          <TabsContent value="resume" className="mt-4">
            <ResumeUpload />
          </TabsContent>
        </Tabs>
      </div>

      <ProjectForm
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editingProject}
        onSaved={fetchProjects}
      />
    </main>
  )
}
