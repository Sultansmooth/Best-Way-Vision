'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/auth-context'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navbar } from '@/components/layout/navbar'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {!isLoginPage && <Navbar />}
        <main>
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </div>
    </AuthProvider>
  )
}
