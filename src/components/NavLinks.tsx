// src/components/NavLinks.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LIBRARIES = [
  { label: 'P0 Charts', href: '/charts/p0'       },
  { label: 'Recharts',  href: '/charts/recharts'  },
  { label: 'Plotly',    href: '/charts/plotly'    },
  { label: 'Nivo',      href: '/charts/nivo'      },
  { label: 'ECharts',   href: '/charts/echarts'   },
  { label: 'D3',        href: '/charts/d3'        },
] as const

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1">
      {LIBRARIES.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            pathname === href
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
