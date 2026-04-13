// src/app/charts/layout.tsx
import Link from 'next/link'
import { NavLinks } from '@/components/NavLinks'

export default function ChartsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
          <Link
            href="/charts/recharts"
            className="mr-8 text-sm font-bold text-gray-900 tracking-tight"
          >
            RFC Charts
          </Link>
          <NavLinks />
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  )
}
