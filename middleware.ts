import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/dang-nhap']

export function middleware(request: NextRequest) {
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const token = localStorage.getItem('auth-token')

  if (!token) {
    const url = new URL('/dang-nhap', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
