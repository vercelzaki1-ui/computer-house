"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { ProductEditor } from "../../product-editor"

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const productId = useMemo(() => String(params?.id || ""), [params])

  return <ProductEditor mode="edit" productId={productId} />
}
