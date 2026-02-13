"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Star, ShoppingCart, Heart, MessageCircle, Truck, Shield,
  ChevronRight, Minus, Plus, ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/store/product-card"
import { useLocale } from "@/lib/locale-context"
import { useCart } from "@/lib/cart-store"
import { products, formatPrice, type Product } from "@/lib/data"

export function ProductPageClient({ product }: { product: Product }) {
  const { locale, t } = useLocale()
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const recommended = products
    .filter((p) => p.department === product.department && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">{t.nav.home}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-primary">{t.nav.shop}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{product.name[locale]}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name[locale]}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-primary/10">
                  <ShoppingBag className="h-16 w-16 text-primary/40" />
                </div>
              </div>
            )}
            {/* Badges */}
            <div className="absolute start-4 top-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-blue-600 text-white">{locale === "fr" ? "Nouveau" : "جديد"}</Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-red-600 text-white">-{discount}%</Badge>
              )}
            </div>
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImageIndex === idx ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name[locale]} ${idx + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <p className="text-sm font-medium uppercase tracking-wide text-primary">{product.brand}</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {product.name[locale]}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} {t.product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-end gap-3">
            <span className="font-heading text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {discount > 0 && (
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {locale === "fr" ? `Economisez ${formatPrice(product.compareAtPrice! - product.price)}` : `وفر ${formatPrice(product.compareAtPrice! - product.price)}`}
              </Badge>
            )}
          </div>

          {/* Stock */}
          <div className="mt-3">
            <span className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
              {product.inStock ? `${t.sections.inStock} (${product.stockCount})` : t.sections.outOfStock}
            </span>
          </div>

          <Separator className="my-6" />

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description[locale]}
          </p>

          {/* Qty + Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center border-x border-border text-sm font-medium text-foreground">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={() => addItem(product, qty)}
              disabled={!product.inStock}
              size="lg"
              className="flex-1 gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {t.sections.addToCart}
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Buy Now */}
          <Link href="/checkout" className="mt-3">
            <Button
              variant="secondary"
              size="lg"
              className="w-full gap-2"
              onClick={() => addItem(product, qty)}
            >
              {t.sections.buyNow}
            </Button>
          </Link>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/213550000000?text=${encodeURIComponent(product.name.fr)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3"
          >
            <Button variant="outline" className="w-full gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
              <MessageCircle className="h-4 w-4" />
              {t.product.askWhatsApp}
            </Button>
          </a>

          {/* Trust */}
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <Truck className="h-4 w-4 text-primary" />
              {t.trust.delivery} - {t.trust.deliveryDesc}
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              {t.trust.warranty} - {t.trust.warrantyDesc}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="specs" className="mt-12">
        <TabsList className="bg-muted">
          <TabsTrigger value="specs">{t.product.specs}</TabsTrigger>
          <TabsTrigger value="description">{t.product.description}</TabsTrigger>
          <TabsTrigger value="reviews">{t.product.reviews} ({product.reviewCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="specs" className="mt-4">
          <div className="rounded-xl border border-border bg-card">
            {Object.entries(product.specs).map(([key, value], i) => (
              <div
                key={key}
                className={`flex items-center justify-between px-5 py-3 ${
                  i % 2 === 0 ? "bg-muted/50" : ""
                } ${i < Object.entries(product.specs).length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-sm font-medium text-muted-foreground">{key}</span>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="description" className="mt-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description[locale]}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {locale === "fr" ? "Les avis seront bientot disponibles." : "التقييمات ستكون متاحة قريبا."}
            </p>
            <Button className="mt-4" variant="outline">{t.product.writeReview}</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
            {t.product.recommended}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
