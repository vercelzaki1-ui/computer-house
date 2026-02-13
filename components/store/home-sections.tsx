"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Shield, Truck, Banknote, Headphones, Star, ArrowRight,
  Laptop, Cpu, Mouse, Wifi, Camera, Printer, Package,
  Send, MessageCircle, Monitor, MonitorCheck, Smartphone,
  FileText, HardDrive, Armchair, Sparkles, TrendingUp, Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "./product-card"
import { useLocale } from "@/lib/locale-context"
import { collections, testimonials } from "@/lib/data"
import type { Product } from "@/lib/data"
import { getMegaMenuTaxonomy } from "@/app/(store)/actions"
import { getProducts } from "@/app/(store)/actions"

const deptIcons: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="h-6 w-6" />,
  Laptop: <Laptop className="h-6 w-6" />,
  Cpu: <Cpu className="h-6 w-6" />,
  MonitorCheck: <MonitorCheck className="h-6 w-6" />,
  Smartphone: <Smartphone className="h-6 w-6" />,
  Camera: <Camera className="h-6 w-6" />,
  Wifi: <Wifi className="h-6 w-6" />,
  Printer: <Printer className="h-6 w-6" />,
  FileText: <FileText className="h-6 w-6" />,
  Mouse: <Mouse className="h-6 w-6" />,
  HardDrive: <HardDrive className="h-6 w-6" />,
  Armchair: <Armchair className="h-6 w-6" />,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function DepartmentsGrid() {
  const { locale, t } = useLocale()
  const [departments, setDepartments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadDepartments() {
      setIsLoading(true)
      try {
        const rows = await getMegaMenuTaxonomy()
        if (!active) return
        setDepartments(Array.isArray(rows) ? rows : [])
      } catch (error) {
        console.error("Failed to load departments grid taxonomy:", error)
        if (active) {
          setDepartments([])
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadDepartments()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mb-12 flex items-end justify-between">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.sections.departments}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {locale === "fr" ? "Parcourez nos catégories" : "تصفح فئاتنا"}
            </p>
          </motion.div>
        </div>
        <Link href="/shop" className="hidden sm:inline-flex">
          <Button variant="ghost" size="sm" className="group gap-2 text-primary hover:gap-3 transition-all">
            {t.sections.viewAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-visible"
      >
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`dept-skeleton-${i}`}
              className="h-32 min-w-[280px] animate-pulse rounded-2xl border border-border bg-gradient-to-br from-muted/40 to-muted/20 sm:min-w-0"
            />
          ))}
        {!isLoading &&
          departments.map((dept, i) => (
            <motion.div key={dept.id} variants={itemVariants}>
              <Link
                href={`/shop?department=${encodeURIComponent(dept.slug)}`}
                className="group relative flex min-w-[280px] items-start gap-5 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 sm:min-w-0"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:from-primary group-hover:to-primary/90 group-hover:text-primary-foreground">
                  {deptIcons[dept.icon as keyof typeof deptIcons] || <Monitor className="h-6 w-6" />}
                </div>

                <div className="relative flex-1 space-y-3">
                  <h3 className="font-heading text-base font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {locale === "ar" ? dept.name_ar : dept.name_fr}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(dept.categories || []).slice(0, 3).map((cat: any) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center rounded-lg bg-muted/80 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                      >
                        {locale === "ar" ? cat.name_ar : cat.name_fr}
                      </span>
                    ))}
                  </div>
                </div>

                <ArrowRight className="relative h-5 w-5 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
            </motion.div>
          ))}
      </motion.div>
    </section>
  )
}

export function CollectionsSection() {
  const { locale, t } = useLocale()

  return (
    <section className="relative bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.sections.collections}
            </h2>
            <p className="text-base text-muted-foreground">
              {locale === "fr" ? "Des packs pensés pour chaque besoin" : "حزم مصممة لكل حاجة"}
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {collections.map((col, i) => (
            <motion.div key={col.id} variants={itemVariants}>
              <Link
                href={`/shop?collection=${col.slug}`}
                className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-border/50 bg-card p-8 text-center shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Icon container */}
                <div className="relative mb-6">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${col.color} shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-3`}>
                    <Package className="h-7 w-7 text-white" />
                  </div>
                  {/* Decorative ring */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${col.color} opacity-20 blur-xl transition-all duration-300 group-hover:scale-125`} />
                </div>

                <div className="relative space-y-3">
                  <h3 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-primary">
                    {col.name[locale]}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {col.description[locale]}
                  </p>
                  
                  {/* Product count badge */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Sparkles className="h-3 w-3" />
                    {col.productCount} {locale === "fr" ? "produits" : "منتج"}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function FeaturedProducts() {
  const { locale, t } = useLocale()
  const [tab, setTab] = useState("bestSellers")
  const [products, setProducts] = useState<Array<Product & { created_at?: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadProducts() {
      setIsLoading(true)
      try {
        const result = await getProducts({ limit: 12 })
        if (!active) return
        const normalized = (result?.products || []).map((product: any) => ({
          id: product.id,
          slug: product.slug,
          name: {
            fr: product.title_fr || "",
            ar: product.title_ar || product.title_fr || "",
          },
          description: {
            fr: product.description_fr || "",
            ar: product.description_ar || product.description_fr || "",
          },
          price: product.price_dzd || 0,
          compareAtPrice: product.compare_at_price_dzd || undefined,
          images: (product.product_images || []).map((image: any) => image.url),
          category: product.categories?.slug || "",
          department: product.departments?.slug || "",
          brand: product.brands?.name || "",
          rating: 5,
          reviewCount: 0,
          inStock: (product.stock || 0) > 0,
          stockCount: product.stock || 0,
          specs: {},
          tags: [],
          isNew: false,
          isBestSeller: Boolean(product.is_featured),
          isDeal: Boolean(product.compare_at_price_dzd && product.compare_at_price_dzd > product.price_dzd),
          created_at: product.created_at,
        }))
        setProducts(normalized)
      } catch (error) {
        console.error("Failed to load featured products:", error)
        if (active) setProducts([])
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadProducts()

    return () => {
      active = false
    }
  }, [])

  const latestProducts = useMemo(
    () =>
      [...products].sort((a, b) =>
        (b.created_at || "").localeCompare(a.created_at || "")
      ),
    [products]
  )

  const filtered = {
    bestSellers: products.filter((p) => p.isBestSeller),
    new: latestProducts,
    deals: products.filter((p) => p.isDeal),
  }

  const tabIcons = {
    bestSellers: TrendingUp,
    new: Sparkles,
    deals: Zap,
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.sections.featured}
          </h2>
          <p className="text-base text-muted-foreground">
            {locale === "fr" ? "Notre sélection pour vous" : "اختيارنا لك"}
          </p>
        </motion.div>
        <Link href="/shop">
          <Button variant="outline" size="sm" className="group gap-2 border-primary/20 hover:gap-3 hover:border-primary transition-all">
            {t.sections.viewAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-8">
        <TabsList className="inline-flex h-auto gap-2 rounded-xl bg-muted/50 p-1.5 backdrop-blur-sm">
          {(Object.keys(filtered) as Array<keyof typeof filtered>).map((key) => {
            const Icon = tabIcons[key]
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
              >
                <Icon className="h-4 w-4" />
                {key === "bestSellers" && t.sections.bestSellers}
                {key === "new" && t.sections.newArrivals}
                {key === "deals" && t.sections.deals}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {(Object.keys(filtered) as Array<keyof typeof filtered>).map((key) => (
          <TabsContent key={key} value={key}>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={`product-skeleton-${key}-${i}`}
                    className="h-80 animate-pulse rounded-2xl border border-border bg-gradient-to-br from-muted/40 to-muted/20"
                  />
                ))}
              </div>
            ) : filtered[key].length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
              >
                {filtered[key].map((product, i) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-muted/20 p-12 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-base font-medium text-muted-foreground">
                  {locale === "fr" ? "Aucun produit pour le moment" : "لا توجد منتجات حاليا"}
                </p>
              </motion.div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

export function TrustSection() {
  const { t } = useLocale()
  const items = [
    { icon: Shield, title: t.trust.warranty, desc: t.trust.warrantyDesc, color: "from-blue-500 to-blue-600" },
    { icon: Truck, title: t.trust.delivery, desc: t.trust.deliveryDesc, color: "from-green-500 to-green-600" },
    { icon: Banknote, title: t.trust.cod, desc: t.trust.codDesc, color: "from-amber-500 to-amber-600" },
    { icon: Headphones, title: t.trust.support, desc: t.trust.supportDesc, color: "from-purple-500 to-purple-600" },
  ]

  return (
    <section className="border-y border-border/50 bg-gradient-to-b from-card via-muted/30 to-card py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative"
            >
              <div className="flex items-start gap-5 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                {/* Gradient background on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.color} opacity-20 blur-xl transition-all duration-300 group-hover:scale-125`} />
                </div>

                <div className="relative space-y-1">
                  <h3 className="text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  const { locale, t } = useLocale()

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/3 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.sections.testimonials}
          </h2>
          <p className="text-base text-muted-foreground">
            {locale === "fr" ? "Ce que disent nos clients" : "ما يقوله عملاؤنا"}
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {testimonials.slice(0, 3).map((item, i) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="group relative"
          >
            <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-7 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
              {/* Quote decoration */}
              <div className="absolute right-6 top-6 text-6xl font-serif text-primary/10 transition-all duration-300 group-hover:text-primary/20 group-hover:scale-110">
                "
              </div>

              {/* Star rating */}
              <div className="relative mb-5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 transition-all duration-300 ${
                      j < item.rating
                        ? "fill-amber-400 text-amber-400 group-hover:scale-110"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="relative mb-6 text-sm leading-relaxed text-muted-foreground">
                {`"${item.text[locale]}"`}
              </p>

              {/* Author info */}
              <div className="relative flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-bold text-primary ring-2 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:ring-primary/40">
                  {item.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.city}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export function NewsletterSection() {
  const { locale, t } = useLocale()
  const [email, setEmail] = useState("")

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-10 md:flex-row md:justify-between"
        >
          <div className="text-center md:text-start">
            <h2 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
              {t.sections.newsletter}
            </h2>
            <p className="mt-3 text-base text-primary-foreground/80">
              {t.sections.newsletterSub}
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.sections.emailPlaceholder}
                  className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/40 focus:ring-primary-foreground/20 backdrop-blur-sm"
                />
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="group h-12 gap-2 px-6 font-semibold shadow-xl transition-all hover:gap-3 hover:shadow-2xl"
              >
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                {t.sections.subscribe}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* WhatsApp CTA */}
      <div className="relative border-t border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href="https://wa.me/213550000000"
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto flex w-fit items-center justify-center gap-3 rounded-full bg-primary-foreground/10 px-6 py-3 backdrop-blur-sm transition-all hover:bg-primary-foreground/20 hover:shadow-lg"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 shadow-lg transition-transform group-hover:scale-110">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-primary-foreground transition-all group-hover:tracking-wide">
                {t.sections.whatsappCta}
              </span>
              <ArrowRight className="h-4 w-4 text-primary-foreground/70 transition-all group-hover:translate-x-1 group-hover:text-primary-foreground" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}