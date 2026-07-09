import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'

const RESUME_BUCKET = 'resume'
const RESUME_FILENAME = 'curriculo.pdf'
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin.storage
    .from(RESUME_BUCKET)
    .list('', { search: RESUME_FILENAME })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const file = data.find((entry) => entry.name === RESUME_FILENAME)

  if (!file) {
    return NextResponse.json({ exists: false })
  }

  return NextResponse.json({
    exists: true,
    name: file.name,
    size: file.metadata?.size ?? null,
    updatedAt: file.updated_at,
  })
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'O arquivo precisa ser um PDF.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'O arquivo deve ter no máximo 5MB.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.storage
    .from(RESUME_BUCKET)
    .upload(RESUME_FILENAME, file, { upsert: true, contentType: 'application/pdf' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
