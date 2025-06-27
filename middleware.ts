import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/dang-nhap']

export function middleware(request: NextRequest) {

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
