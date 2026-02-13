import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  getCategoriesByDepartment,
  getDepartmentBySlug,
  getProducts,
} from "@/app/(store)/actions"

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function DepartmentPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const department = await getDepartmentBySlug(slug)

  if (!department) {
    notFound()
  }

  const [categories, productsResult] = await Promise.all([
    getCategoriesByDepartment(department.id, null),
    getProducts({ departmentId: department.id, limit: 48 }),
  ])

  const categoryRows = Array.isArray(categories) ? categories : []
  const products = productsResult?.products || []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Accueil
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-primary">
          Boutique
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{department.name_fr}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{department.name_fr}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{products.length} produit(s) disponible(s)</p>
      </div>

      {categoryRows.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categoryRows.map((category) => (
            <Link
              key={category.id}
              href={`/shop?department=${encodeURIComponent(department.slug)}&category=${encodeURIComponent(category.slug)}`}
            >
              <Button variant="outline" size="sm" className="text-sm">
                {category.name_fr}
              </Button>
            </Link>
          ))}
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product: any) => (
            <Link key={product.id} href={`/product/${product.slug}`}>
              <Card className="h-full border-border transition-colors hover:border-primary/40">
                <CardContent className="space-y-2 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brands?.name || "Brand"}</p>
                  <p className="line-clamp-2 text-sm font-semibold text-foreground">{product.title_fr}</p>
                  <p className="text-xs text-muted-foreground">{product.title_ar}</p>
                  <p className="text-sm font-bold text-primary">{formatPrice(product.price_dzd)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20">
          <p className="text-lg font-semibold text-foreground">Aucun produit trouve</p>
          <Link href="/shop" className="mt-4">
            <Button className="gap-2">
              Retour a la boutique
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
