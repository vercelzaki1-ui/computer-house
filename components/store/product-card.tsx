"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/lib/locale-context"
import { useCart } from "@/lib/cart-store"
import type { Product } from "@/lib/data"
import { formatPrice } from "@/lib/data"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { locale, t } = useLocale()
  const { addItem } = useCart()
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Badges */}
      <div className="absolute start-3 top-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <Badge className="bg-blue-600 text-white hover:bg-blue-700">
            {locale === "fr" ? "Nouveau" : "جديد"}
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="bg-red-600 text-white hover:bg-red-700">
            -{discount}%
          </Badge>
        )}
        {product.isBestSeller && (
          <Badge className="bg-amber-600 text-white hover:bg-amber-700">
            {locale === "fr" ? "Best Seller" : "الاكثر مبيعا"}
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="absolute end-3 top-3 z-10 flex flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-card/90 shadow-md backdrop-blur-sm hover:bg-card text-foreground"
          aria-label={t.nav.wishlist}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Link href={`/product/${product.slug}`}>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-card/90 shadow-md backdrop-blur-sm hover:bg-card text-foreground"
            aria-label="View product"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted p-6">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name[locale]}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingCart className="h-8 w-8 text-primary/40" />
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">
            {product.name[locale]}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        <p className={`mt-1.5 text-xs font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
          {product.inStock ? t.sections.inStock : t.sections.outOfStock}
        </p>

        {/* Add to Cart */}
        <Button
          onClick={() => addItem(product)}
          disabled={!product.inStock}
          className="mt-3 w-full gap-2"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          {t.sections.addToCart}
        </Button>
      </div>
    </motion.div>
  )
}
