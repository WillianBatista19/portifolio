import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { uploadProjectImage } from '@/lib/supabase'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const formData = await request.formData()

  const imageFile = formData.get('image')
  let imageUrl = (formData.get('imageUrl') as string) || null
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadProjectImage(imageFile)
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      name: formData.get('name') as string,
      tagline: formData.get('tagline') as string,
      description: formData.get('description') as string,
      stack: JSON.parse((formData.get('stack') as string) || '[]'),
      liveUrl: (formData.get('liveUrl') as string) || null,
      githubUrl: (formData.get('githubUrl') as string) || null,
      imageUrl,
      isPrivate: formData.get('isPrivate') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      order: Number(formData.get('order')) || 0,
      highlights: JSON.parse((formData.get('highlights') as string) || '[]'),
    },
  })

  return NextResponse.json(project)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await prisma.project.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
