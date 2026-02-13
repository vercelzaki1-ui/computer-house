"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
/* eslint-disable @next/next/no-img-element */
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck,
  FileText, Settings, Menu, X, LogOut,
  Bell, Search, Tags, MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { logoutAdmin } from "@/app/admin/actions"

function LogoutButton() {
  const handleLogout = async () => {
    await logoutAdmin()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
      size="sm"
    >
      <LogOut className="h-4 w-4" />
      Deconnexion
    </Button>
  )
}

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/admin/products", icon: Package, label: "Produits" },
  { href: "/admin/categories", icon: Tags, label: "Catégories" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Commandes" },
  { href: "/admin/customers", icon: Users, label: "Clients" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  { href: "/admin/shipping", icon: Truck, label: "Livraison" },
  { href: "/admin/content", icon: FileText, label: "Contenu" },
  { href: "/admin/settings", icon: Settings, label: "Parametres" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-border bg-card transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bW70tCNYfU4dioNQ6iPrgQN9yQlB48.png"
              alt="ComputerHouse"
              width={32}
              height={32}
              className="rounded-md"
            />
            <div>
              <span className="block text-sm font-bold text-foreground">ComputerHouse</span>
              <span className="block text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                Admin Panel
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <link.icon className="h-4.5 w-4.5 shrink-0" />
                  {link.label}
                  {link.label === "Commandes" && (
                    <Badge className="ms-auto h-5 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                      12
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Retour au site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="w-64 ps-9"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
