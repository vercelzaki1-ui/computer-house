"use client"

import { useState, useMemo } from "react"
import { Cpu, HardDrive, CircuitBoard, Monitor, Fan, Zap, Box, Plus, X, ShoppingCart, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/lib/locale-context"
import { useCart } from "@/lib/cart-store"
import { products, formatPrice } from "@/lib/data"

interface PCPart {
  category: string
  icon: React.ElementType
  name: { fr: string; ar: string }
  options: { id: string; name: string; price: number }[]
}

const pcParts: PCPart[] = [
  {
    category: "cpu",
    icon: Cpu,
    name: { fr: "Processeur", ar: "المعالج" },
    options: [
      { id: "cpu1", name: "Intel Core i5-13400F", price: 52000 },
      { id: "cpu2", name: "Intel Core i7-13700K", price: 89000 },
      { id: "cpu3", name: "Intel Core i9-14900K", price: 128000 },
      { id: "cpu4", name: "AMD Ryzen 5 7600X", price: 55000 },
      { id: "cpu5", name: "AMD Ryzen 7 7800X3D", price: 98000 },
      { id: "cpu6", name: "AMD Ryzen 9 7950X", price: 132000 },
    ],
  },
  {
    category: "gpu",
    icon: Monitor,
    name: { fr: "Carte Graphique", ar: "بطاقة الرسومات" },
    options: [
      { id: "gpu1", name: "NVIDIA RTX 4060 8GB", price: 82000 },
      { id: "gpu2", name: "NVIDIA RTX 4060 Ti 8GB", price: 105000 },
      { id: "gpu3", name: "NVIDIA RTX 4070 SUPER 12GB", price: 142000 },
      { id: "gpu4", name: "NVIDIA RTX 4080 SUPER 16GB", price: 265000 },
      { id: "gpu5", name: "AMD RX 7800 XT 16GB", price: 115000 },
    ],
  },
  {
    category: "ram",
    icon: CircuitBoard,
    name: { fr: "Memoire RAM", ar: "الذاكرة" },
    options: [
      { id: "ram1", name: "16GB DDR5 5200MHz", price: 15000 },
      { id: "ram2", name: "32GB DDR5 5600MHz", price: 28500 },
      { id: "ram3", name: "32GB DDR5 6000MHz", price: 35000 },
      { id: "ram4", name: "64GB DDR5 5600MHz", price: 58000 },
    ],
  },
  {
    category: "storage",
    icon: HardDrive,
    name: { fr: "Stockage", ar: "التخزين" },
    options: [
      { id: "st1", name: "512GB NVMe SSD", price: 12000 },
      { id: "st2", name: "1TB NVMe SSD", price: 22000 },
      { id: "st3", name: "2TB NVMe SSD (Samsung 990 PRO)", price: 45000 },
      { id: "st4", name: "4TB NVMe SSD", price: 78000 },
    ],
  },
  {
    category: "psu",
    icon: Zap,
    name: { fr: "Alimentation", ar: "وحدة الطاقة" },
    options: [
      { id: "psu1", name: "550W 80+ Bronze", price: 12000 },
      { id: "psu2", name: "650W 80+ Gold", price: 18000 },
      { id: "psu3", name: "750W 80+ Gold", price: 24000 },
      { id: "psu4", name: "850W 80+ Gold", price: 32000 },
      { id: "psu5", name: "1000W 80+ Platinum", price: 48000 },
    ],
  },
  {
    category: "case",
    icon: Box,
    name: { fr: "Boitier", ar: "الصندوق" },
    options: [
      { id: "c1", name: "Mid-Tower ATX Basic", price: 10000 },
      { id: "c2", name: "Mid-Tower ATX RGB", price: 18000 },
      { id: "c3", name: "Full-Tower Gaming", price: 28000 },
      { id: "c4", name: "Mini-ITX Compact", price: 22000 },
    ],
  },
  {
    category: "cooler",
    icon: Fan,
    name: { fr: "Refroidissement", ar: "التبريد" },
    options: [
      { id: "cl1", name: "Ventilateur Tower (Air)", price: 8000 },
      { id: "cl2", name: "AIO 240mm", price: 18000 },
      { id: "cl3", name: "AIO 360mm", price: 28000 },
      { id: "cl4", name: "Custom Loop (Kit)", price: 55000 },
    ],
  },
]

export default function BuildYourPCPage() {
  const { locale, t } = useLocale()
  const { addItem } = useCart()
  const [selections, setSelections] = useState<Record<string, string>>({})

  const selectPart = (category: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [category]: optionId }))
  }

  const removePart = (category: string) => {
    setSelections((prev) => {
      const next = { ...prev }
      delete next[category]
      return next
    })
  }

  const totalPrice = useMemo(() => {
    return pcParts.reduce((acc, part) => {
      const selectedOption = part.options.find((o) => o.id === selections[part.category])
      return acc + (selectedOption?.price || 0)
    }, 0)
  }, [selections])

  const selectedCount = Object.keys(selections).length
  const isComplete = selectedCount === pcParts.length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {t.nav.buildPC}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === "fr"
            ? "Selectionnez vos composants et construisez votre PC ideal"
            : "اختر مكوناتك وابنِ حاسوبك المثالي"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Parts Selector */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {pcParts.map((part) => {
            const selected = part.options.find((o) => o.id === selections[part.category])
            const Icon = part.icon

            return (
              <div
                key={part.category}
                className={`rounded-xl border bg-card p-5 transition-colors ${
                  selected ? "border-primary/30 shadow-sm" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{part.name[locale]}</h3>
                      {selected && (
                        <p className="text-xs text-primary">{selected.name}</p>
                      )}
                    </div>
                  </div>
                  {selected && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{formatPrice(selected.price)}</span>
                      <button onClick={() => removePart(part.category)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <Select
                    value={selections[part.category] || ""}
                    onValueChange={(v) => selectPart(part.category, v)}
                  >
                    <SelectTrigger className={selected ? "border-primary/30" : ""}>
                      <SelectValue placeholder={locale === "fr" ? "Choisir..." : "اختر..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {part.options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <span className="flex w-full items-center justify-between gap-4">
                            <span>{option.name}</span>
                            <span className="font-semibold text-primary">{formatPrice(option.price)}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground">
              {locale === "fr" ? "Votre configuration" : "اعداداتك"}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <Badge className={isComplete ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}>
                {selectedCount} / {pcParts.length}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {locale === "fr" ? "composants selectionnes" : "مكونات مختارة"}
              </span>
            </div>

            <Separator className="my-4" />

            <div className="flex flex-col gap-2.5">
              {pcParts.map((part) => {
                const selected = part.options.find((o) => o.id === selections[part.category])
                return (
                  <div key={part.category} className="flex items-center justify-between text-sm">
                    <span className={selected ? "text-foreground" : "text-muted-foreground"}>
                      {part.name[locale]}
                    </span>
                    {selected ? (
                      <span className="font-medium text-foreground">{formatPrice(selected.price)}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">---</span>
                    )}
                  </div>
                )
              })}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-foreground">Total</span>
              <span className="font-heading text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
            </div>

            {!isComplete && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  {locale === "fr"
                    ? "Selectionnez tous les composants pour completer votre configuration."
                    : "اختر جميع المكونات لاكمال اعداداتك."}
                </p>
              </div>
            )}

            <Button
              className="mt-4 w-full gap-2"
              size="lg"
              disabled={!isComplete}
            >
              <ShoppingCart className="h-5 w-5" />
              {locale === "fr" ? "Ajouter tout au panier" : "اضف الكل الى السلة"}
            </Button>

            <a
              href={`https://wa.me/213550000000?text=${encodeURIComponent(
                locale === "fr"
                  ? `Bonjour, je souhaite commander cette configuration: ${pcParts
                      .map((p) => {
                        const s = p.options.find((o) => o.id === selections[p.category])
                        return s ? `${p.name.fr}: ${s.name}` : ""
                      })
                      .filter(Boolean)
                      .join(", ")}. Total: ${formatPrice(totalPrice)}`
                  : `مرحبا، اريد طلب هذا الاعداد: ${pcParts
                      .map((p) => {
                        const s = p.options.find((o) => o.id === selections[p.category])
                        return s ? `${p.name.ar}: ${s.name}` : ""
                      })
                      .filter(Boolean)
                      .join("، ")}. المجموع: ${formatPrice(totalPrice)}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="mt-2 w-full gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
                {locale === "fr" ? "Commander via WhatsApp" : "اطلب عبر واتساب"}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
