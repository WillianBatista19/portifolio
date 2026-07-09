import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side: safe to expose, respects Row Level Security
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side only: bypasses Row Level Security, never expose to the client
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Uploads a project screenshot server-side (service role) so the
// `project-images` bucket never needs a public write policy.
export async function uploadProjectImage(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${file.name}`

  const { error } = await supabaseAdmin.storage
    .from('project-images')
    .upload(path, file)

  if (error) throw new Error(error.message)

  const { data } = supabaseAdmin.storage.from('project-images').getPublicUrl(path)
  return data.publicUrl
}
