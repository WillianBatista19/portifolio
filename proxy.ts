import { NextRequest, NextResponse } from 'next/server'
import { isValidSessionCookie, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

// Protect /admin/dashboard/* — redirect to /admin if no valid cookie
export async function proxy(request: NextRequest) {
  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value

  if (!(await isValidSessionCookie(cookieValue))) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}
