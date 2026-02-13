"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search, ArrowRight } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useLocale } from "@/lib/locale-context"
import { products, collections, formatPrice } from "@/lib/data"
import { getMegaMenuTaxonomy } from "@/app/(store)/actions"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { locale, t } = useLocale()
  const [query, setQuery] = useState("")
  const [departments, setDepartments] = useState<any[]>([])

  useEffect(() => {
    if (!open) return

    let active = true

    async function loadDepartments() {
      try {
        const rows = await getMegaMenuTaxonomy()
        if (!active) return
        setDepartments(Array.isArray(rows) ? rows : [])
      } catch (error) {
        console.error("Failed to load search taxonomy:", error)
        if (active) {
          setDepartments([])
        }
      }
    }

    void loadDepartments()

    return () => {
      active = false
    }
  }, [open])

  const filteredProducts = useMemo(() => {
    if (!query) return products.slice(0, 5)
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        p.name[locale].toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [query, locale])

  const filteredDepts = useMemo(() => {
    if (!query) return departments.slice(0, 3)
    const q = query.toLowerCase()
    return departments.filter((d) =>
      (locale === "ar" ? d.name_ar : d.name_fr).toLowerCase().includes(q)
    )
  }, [departments, query, locale])

  const filteredCollections = useMemo(() => {
    if (!query) return collections.slice(0, 3)
    const q = query.toLowerCase()
    return collections.filter((c) =>
      c.name[locale].toLowerCase().includes(q)
    )
  }, [query, locale])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t.nav.search}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {locale === "fr" ? "Aucun resultat trouve." : "لا توجد نتائج."}
        </CommandEmpty>
        <CommandGroup heading={locale === "fr" ? "Produits" : "المنتجات"}>
          {filteredProducts.map((product) => (
            <CommandItem key={product.id} asChild>
              <Link
                href={`/product/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{product.name[locale]}</span>
                  <span className="text-xs text-muted-foreground">{product.brand}</span>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(product.price)}
                </span>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={locale === "fr" ? "Departements" : "الاقسام"}>
          {filteredDepts.map((dept) => (
            <CommandItem key={dept.id} asChild>
              <Link
                href={`/shop?department=${encodeURIComponent(dept.slug)}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{locale === "ar" ? dept.name_ar : dept.name_fr}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={locale === "fr" ? "Collections" : "المجموعات"}>
          {filteredCollections.map((col) => (
            <CommandItem key={col.id} asChild>
              <Link
                href={`/shop?collection=${col.slug}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{col.name[locale]}</span>
                <span className="text-xs text-muted-foreground">
                  {col.productCount} {locale === "fr" ? "produits" : "منتج"}
                </span>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="border-t border-border p-2">
        <Link
          href={`/search?q=${encodeURIComponent(query)}`}
          onClick={() => onOpenChange(false)}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Search className="h-4 w-4" />
          {locale === "fr" ? "Voir tous les resultats" : "عرض جميع النتائج"}
        </Link>
      </div>
    </CommandDialog>
  )
}
