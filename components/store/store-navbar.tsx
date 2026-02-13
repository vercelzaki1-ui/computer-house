"use client"

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Heart,
  Laptop,
  Menu,
  Monitor,
  MonitorCheck,
  Moon,
  Search,
  ShoppingCart,
  Smartphone,
  Sun,
  Wifi,
  Cpu,
  Printer,
  FileText,
  Mouse,
  HardDrive,
  Armchair,
  User,
  X,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchDialog } from "./search-dialog"
import { useLocale } from "@/lib/locale-context"
import { useCart } from "@/lib/cart-store"
import { getMegaMenuTaxonomy } from "@/app/(store)/actions"

interface MegaMenuSubcategory {
  id: string
  slug: string
  name_fr: string
  name_ar: string
}

interface MegaMenuCategory {
  id: string
  slug: string
  name_fr: string
  name_ar: string
  children: MegaMenuSubcategory[]
}

interface MegaMenuDepartment {
  id: string
  slug: string
  name_fr: string
  name_ar: string
  icon?: string | null
  categories: MegaMenuCategory[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  monitor: Monitor,
  laptop: Laptop,
  cpu: Cpu,
  monitorcheck: MonitorCheck,
  smartphone: Smartphone,
  camera: Camera,
  wifi: Wifi,
  printer: Printer,
  filetext: FileText,
  mouse: Mouse,
  harddrive: HardDrive,
  armchair: Armchair,
}

const emojiToIconKey: Record<string, string> = {
  "🖥️": "monitor",
  "💻": "laptop",
  "🔧": "cpu",
  "📺": "monitorcheck",
  "📱": "smartphone",
  "📷": "camera",
  "🌐": "wifi",
  "🖨️": "printer",
  "📄": "filetext",
  "🎮": "mouse",
  "💾": "harddrive",
  "🪑": "armchair",
  "🍎": "smartphone",
}

const slugToIconKey: Record<string, string> = {
  informatique: "laptop",
  electronique: "monitorcheck",
  "pcs-gaming": "cpu",
  laptops: "laptop",
  composants: "cpu",
  moniteurs: "monitor",
  apple: "smartphone",
  cameras: "camera",
  reseau: "wifi",
  imprimantes: "printer",
  bureautique: "filetext",
  peripheriques: "mouse",
  accessoires: "mouse",
  stockage: "harddrive",
  "chaises-bureaux": "armchair",
}

function normalizeIconKey(value?: string | null) {
  if (!value) return ""
  return value.toLowerCase().trim().replace(/[\s_-]/g, "").replace(/[^a-z]/g, "")
}

function DeptIcon({ name, slug, className }: { name?: string | null; slug?: string; className?: string }) {
  const normalizedFromEmoji = name ? emojiToIconKey[name] : undefined
  const normalizedFromName = normalizeIconKey(name)
  const normalizedFromSlug = slug ? slugToIconKey[slug] : undefined

  const iconKey = [normalizedFromEmoji, normalizedFromName, normalizedFromSlug].find(
    (candidate) => !!candidate && !!iconMap[candidate]
  )
  const Icon = (iconKey && iconMap[iconKey]) || Monitor
  return <Icon className={className} />
}

function labelByLocale(locale: "fr" | "ar", fr: string, ar: string) {
  return locale === "ar" ? ar : fr
}

export function StoreNavbar() {
  const { locale, setLocale, t } = useLocale()
  const { totalItems } = useCart()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [taxonomy, setTaxonomy] = useState<MegaMenuDepartment[]>([])
  const [taxonomyLoading, setTaxonomyLoading] = useState(true)
  const [activeDeptId, setActiveDeptId] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileDrill, setMobileDrill] = useState<{ level: number; deptId?: string; catId?: string }>({ level: 0 })

  const megaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let active = true

    async function loadTaxonomy() {
      setTaxonomyLoading(true)
      try {
        const rows = await getMegaMenuTaxonomy()
        if (!active) return
        const departments = Array.isArray(rows) ? rows : []
        setTaxonomy(departments)
        if (departments.length > 0) {
          setActiveDeptId((previous) => previous || departments[0].id)
        }
      } catch (error) {
        console.error("Failed to load mega menu taxonomy:", error)
        if (active) {
          setTaxonomy([])
        }
      } finally {
        if (active) {
          setTaxonomyLoading(false)
        }
      }
    }

    void loadTaxonomy()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false)
      }
    }

    if (megaMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [megaMenuOpen])

  const activeDepartment = useMemo(
    () => taxonomy.find((department) => department.id === activeDeptId) || null,
    [taxonomy, activeDeptId]
  )

  const mobileDepartment = useMemo(
    () => taxonomy.find((department) => department.id === mobileDrill.deptId) || null,
    [taxonomy, mobileDrill.deptId]
  )

  const mobileCategory = useMemo(
    () => mobileDepartment?.categories.find((category) => category.id === mobileDrill.catId) || null,
    [mobileDepartment, mobileDrill.catId]
  )

  const openMegaMenu = () => {
    setMegaMenuOpen((previous) => !previous)
    if (!megaMenuOpen && taxonomy.length > 0) {
      setActiveDeptId(taxonomy[0].id)
    }
  }

  return (
    <>
      <div className="border-b border-border bg-muted/40 px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm">
          <div className="flex gap-4 text-muted-foreground">
            <a href="/contact" className="hover:text-foreground">
              {t.nav.contact}
            </a>
            <span className="hidden sm:inline">|</span>
            <a href="/support" className="hidden hover:text-foreground sm:inline">
              {t.nav.support}
            </a>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 gap-1.5 px-2"
            >
              {mounted ? (
                <>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="hidden text-xs sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
                </>
              ) : (
                <div className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocale(locale === "fr" ? "ar" : "fr")}
              className="h-8 gap-1.5 px-2"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs">{locale === "fr" ? "العربية" : "FR"}</span>
            </Button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bW70tCNYfU4dioNQ6iPrgQN9yQlB48.png"
              alt="ComputerHouse"
              width={40}
              height={40}
              className="rounded-md"
            />
            <div className="hidden sm:block">
              <span className="block text-lg font-bold leading-tight text-foreground">ComputerHouse</span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Maison Tech
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            <div className="relative" ref={megaRef}>
              <button
                onClick={openMegaMenu}
                disabled={taxonomyLoading || taxonomy.length === 0}
                className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Menu className="h-4 w-4" />
                {t.nav.departments}
                <ChevronDown className={`h-4 w-4 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {megaMenuOpen && (
                <div className="absolute left-0 top-full mt-2 flex w-[860px] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                  <div className="w-60 shrink-0 border-r border-border bg-muted/30 p-2">
                    {taxonomy.length === 0 ? (
                      <p className="px-2 py-3 text-xs text-muted-foreground">Aucun departement actif</p>
                    ) : (
                      taxonomy.map((department) => (
                        <Link
                          key={department.id}
                          href={`/shop?department=${encodeURIComponent(department.slug)}`}
                          onMouseEnter={() => setActiveDeptId(department.id)}
                          onClick={() => setMegaMenuOpen(false)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                            activeDepartment?.id === department.id
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <DeptIcon name={department.icon} slug={department.slug} className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {labelByLocale(locale, department.name_fr, department.name_ar)}
                          </span>
                          <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-40 rtl:rotate-180" />
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="flex-1 p-4">
                    {activeDepartment ? (
                      <>
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-foreground">
                            {labelByLocale(locale, activeDepartment.name_fr, activeDepartment.name_ar)}
                          </h3>
                          <Link
                            href={`/shop?department=${encodeURIComponent(activeDepartment.slug)}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            {t.sections.viewAll}
                            <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                          </Link>
                        </div>

                        {activeDepartment.categories.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                            Aucune categorie active dans ce departement.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {activeDepartment.categories.map((category) => (
                              <div key={category.id}>
                                <Link
                                  href={`/shop?department=${encodeURIComponent(activeDepartment.slug)}&category=${encodeURIComponent(category.slug)}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                >
                                  {labelByLocale(locale, category.name_fr, category.name_ar)}
                                </Link>
                                {category.children.length > 0 && (
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {category.children.map((subcategory) => (
                                      <Link
                                        key={subcategory.id}
                                        href={`/shop?department=${encodeURIComponent(activeDepartment.slug)}&category=${encodeURIComponent(category.slug)}&subcategory=${encodeURIComponent(subcategory.slug)}`}
                                        onClick={() => setMegaMenuOpen(false)}
                                        className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                      >
                                        {labelByLocale(locale, subcategory.name_fr, subcategory.name_ar)}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                        Selectionnez un departement.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href="/shop" className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
              {t.nav.shop}
            </Link>
            <Link href="/deals" className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
              {t.nav.deals}
            </Link>
            <Link href="/build-your-pc" className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
              {t.nav.buildPC}
            </Link>
          </nav>

          <div className="flex max-w-md flex-1 items-center gap-2">
            <div className="relative hidden flex-1 sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t.nav.search} className="h-9 pl-9 text-sm" onClick={() => setSearchOpen(true)} readOnly />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">{t.nav.account || "Account"}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">{t.nav.wishlist}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">{t.nav.cart}</span>
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => {
                setMobileOpen((previous) => !previous)
                setMobileDrill({ level: 0 })
              }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-card px-4 py-3 lg:hidden">
            {mobileDrill.level > 0 && (
              <button
                onClick={() => {
                  if (mobileDrill.level === 2) {
                    setMobileDrill({ level: 1, deptId: mobileDrill.deptId })
                  } else {
                    setMobileDrill({ level: 0 })
                  }
                }}
                className="mb-3 flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                {mobileDrill.level === 1 && t.nav.departments}
                {mobileDrill.level === 2 && mobileDepartment && labelByLocale(locale, mobileDepartment.name_fr, mobileDepartment.name_ar)}
              </button>
            )}

            {mobileDrill.level === 0 && (
              <div className="space-y-1">
                <Link href="/shop" className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
                  {t.nav.shop}
                </Link>
                <Link href="/deals" className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
                  {t.nav.deals}
                </Link>
                <Link
                  href="/build-your-pc"
                  className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.nav.buildPC}
                </Link>
                <Link href="/account" className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
                  {locale === "fr" ? "Mon Compte" : "حسابي"}
                </Link>
                <Link href="/wishlist" className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
                  {t.nav.wishlist}
                </Link>

                <div className="my-2 border-t border-border" />
                <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t.nav.departments}
                </p>

                {taxonomyLoading ? (
                  <p className="px-3 py-2 text-xs text-muted-foreground">Chargement...</p>
                ) : taxonomy.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-muted-foreground">Aucun departement actif</p>
                ) : (
                  taxonomy.map((department) => (
                    <button
                      key={department.id}
                      onClick={() => setMobileDrill({ level: 1, deptId: department.id })}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted"
                    >
                      <DeptIcon name={department.icon} slug={department.slug} className="h-4 w-4 text-primary" />
                      <span className="flex-1 text-start">
                        {labelByLocale(locale, department.name_fr, department.name_ar)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
                    </button>
                  ))
                )}
              </div>
            )}

            {mobileDrill.level === 1 && mobileDepartment && (
              <div className="space-y-1">
                <Link
                  href={`/shop?department=${encodeURIComponent(mobileDepartment.slug)}`}
                  className="mb-2 block px-3 py-2 text-sm font-bold text-primary hover:underline"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.sections.viewAll} - {labelByLocale(locale, mobileDepartment.name_fr, mobileDepartment.name_ar)}
                </Link>

                {mobileDepartment.categories.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-muted-foreground">Aucune categorie active</p>
                ) : (
                  mobileDepartment.categories.map((category) =>
                    category.children.length > 0 ? (
                      <button
                        key={category.id}
                        onClick={() => setMobileDrill({ level: 2, deptId: mobileDepartment.id, catId: category.id })}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted"
                      >
                        <span className="flex-1 text-start">
                          {labelByLocale(locale, category.name_fr, category.name_ar)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
                      </button>
                    ) : (
                      <Link
                        key={category.id}
                        href={`/shop?department=${encodeURIComponent(mobileDepartment.slug)}&category=${encodeURIComponent(category.slug)}`}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="flex-1 text-start">
                          {labelByLocale(locale, category.name_fr, category.name_ar)}
                        </span>
                      </Link>
                    )
                  )
                )}
              </div>
            )}

            {mobileDrill.level === 2 && mobileDepartment && mobileCategory && (
              <div className="space-y-1">
                <Link
                  href={`/shop?department=${encodeURIComponent(mobileDepartment.slug)}&category=${encodeURIComponent(mobileCategory.slug)}`}
                  className="mb-2 block px-3 py-2 text-sm font-bold text-primary hover:underline"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.sections.viewAll} - {labelByLocale(locale, mobileCategory.name_fr, mobileCategory.name_ar)}
                </Link>

                {mobileCategory.children.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/shop?department=${encodeURIComponent(mobileDepartment.slug)}&category=${encodeURIComponent(mobileCategory.slug)}&subcategory=${encodeURIComponent(subcategory.slug)}`}
                    className="block rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    {labelByLocale(locale, subcategory.name_fr, subcategory.name_ar)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
