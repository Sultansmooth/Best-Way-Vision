'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Package, Truck, Shield, Settings, Video, LogOut, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Package },
  { name: 'Events', href: '/events', icon: Truck },
  { name: 'Feeds', href: '/feeds', icon: Video },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Admin', href: '/admin', icon: Settings },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center gap-3">
              <img src="/icon.png" alt="Best Way Logo" className="h-8 w-auto object-contain" />
              <h1 className="text-xl font-bold text-green-600">Best Way Vision</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                      isActive
                        ? 'border-green-500 text-gray-900'
                        : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Best Way Distribution
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
