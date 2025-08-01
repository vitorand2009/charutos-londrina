"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/estoque", label: "Estoque" },
    { href: "/degustacao", label: "Degustação" },
    { href: "/historico", label: "Histórico" },
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-orange-500 text-2xl mr-2">🚬</div>
            <h1 className="text-xl font-bold text-gray-900">Charutos Londrina</h1>
          </div>
          <nav className="flex gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={
                    pathname === item.href
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
