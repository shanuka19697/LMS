import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define paths
  const isStudentAuthPath = path === '/login' || path === '/register'
  const isAdminAuthPath = path === '/admin/login'

  const isStudentProtectedPath = path.startsWith('/dashboard')
  const isAdminProtectedPath = path.startsWith('/admin') && path !== '/admin/login'

  const studentToken = request.cookies.get('student_index')?.value || ''
  const adminToken = request.cookies.get('admin_session')?.value || ''

  // Student Protection
  if (isStudentProtectedPath && !studentToken) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Admin Protection
  if (isAdminProtectedPath) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
    }

    const adminRole = request.cookies.get('admin_role')?.value;

    // RBAC Logic
    if (path.startsWith('/admin/students') || path.startsWith('/admin/lessons') || path.startsWith('/admin/sales') || path.startsWith('/admin/notifications') || path.startsWith('/admin/admins')) {
      if (adminRole !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.nextUrl)) // Or some unauthorized page
      }
    }
    
    if (path.startsWith('/admin/papers') || path.startsWith('/admin/paper-marks')) {
      if (adminRole !== 'SUPER_ADMIN' && adminRole !== 'PAPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.nextUrl))
      }
    }

    if (path.startsWith('/admin/messages')) {
      if (adminRole !== 'SUPER_ADMIN' && adminRole !== 'MESSAGE_ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.nextUrl))
      }
    }
  }

  // Student Redirect (if already logged in)
  if (isStudentAuthPath && studentToken) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  // Admin Redirect (if already logged in)
  if (isAdminAuthPath && adminToken) {
    return NextResponse.redirect(new URL('/admin', request.nextUrl))
  }
}

// Ensure middleware runs on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
}
