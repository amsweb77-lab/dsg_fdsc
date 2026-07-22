import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('dsg_session')?.value
  const session = token ? await decrypt(token) : null

  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isFiscalPage = request.nextUrl.pathname.startsWith('/fiscal')

  if (isAuthPage) {
    if (session) {
      if (session.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
      if (session.role === 'FISCAL') return NextResponse.redirect(new URL('/fiscal', request.url))
    }
    return NextResponse.next()
  }

  if (isAdminPage) {
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (isFiscalPage) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/fiscal/:path*', '/fiscal', '/login'],
}
