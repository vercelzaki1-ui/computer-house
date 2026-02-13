"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, ShoppingCart, Heart, Settings, LogOut, Package, MapPin, CreditCard, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/lib/locale-context"
import { formatPrice } from "@/lib/data"
import { getMyOrders, getMyProfile, updateMyProfile } from "../actions"
import { logoutCustomer } from "../auth-actions"

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, Record<string, string>> = {
  fr: { 
    pending: "En attente",
    confirmed: "Confirmee", 
    processing: "En traitement", 
    shipped: "Expediee", 
    delivered: "Livree",
    cancelled: "Annulee"
  },
  ar: { 
    pending: "قيد الانتظار",
    confirmed: "مؤكد", 
    processing: "قيد المعالجة", 
    shipped: "تم الشحن", 
    delivered: "تم التوصيل",
    cancelled: "ملغى"
  },
}

export default function AccountPage() {
  const { locale } = useLocale()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)
  const [addresses, setAddresses] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        // Load profile
        const fetchedProfile = await getMyProfile()
        console.log('👤 Account Page - Profile:', fetchedProfile)
        setProfile(fetchedProfile)

        // Load orders
        const fetchedOrders = await getMyOrders()
        console.log('👤 Account Page - Fetched Orders:', fetchedOrders)
        setOrders(fetchedOrders)
        
        // Calculate total spent
        const total = fetchedOrders.reduce((sum: number, order: any) => {
          return sum + (parseFloat(order.total_dzd) || 0)
        }, 0)
        setTotalSpent(total)

        // Extract unique addresses from orders
        const uniqueAddresses = new Map()
        fetchedOrders.forEach((order: any) => {
          if (order.address_snapshot) {
            const key = `${order.address_snapshot.phone}-${order.address_snapshot.address}`
            if (!uniqueAddresses.has(key)) {
              uniqueAddresses.set(key, {
                ...order.address_snapshot,
                wilaya_code: order.wilaya_code,
                used_count: 1,
                last_used: order.created_at
              })
            } else {
              const existing = uniqueAddresses.get(key)
              existing.used_count++
              if (new Date(order.created_at) > new Date(existing.last_used)) {
                existing.last_used = order.created_at
              }
            }
          }
        })
        setAddresses(Array.from(uniqueAddresses.values()))
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSavingProfile(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateMyProfile(formData)
      
      if (result.error) {
        alert(locale === "fr" ? "Erreur lors de la sauvegarde" : "خطأ في الحفظ")
      } else {
        alert(locale === "fr" ? "Profil mis à jour avec succès" : "تم تحديث الملف الشخصي")
        const updatedProfile = await getMyProfile()
        setProfile(updatedProfile)
      }
    } catch (error) {
      alert(locale === "fr" ? "Erreur lors de la sauvegarde" : "خطأ في الحفظ")
    } finally {
      setIsSavingProfile(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {locale === "fr" ? "Mon Compte" : "حسابي"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === "fr" ? "Gerez vos commandes et informations" : "ادر طلباتك ومعلوماتك"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : orders.length}</p>
              <p className="text-xs text-muted-foreground">{locale === "fr" ? "Commandes" : "طلبات"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">{locale === "fr" ? "Favoris" : "المفضلة"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : formatPrice(totalSpent)}</p>
              <p className="text-xs text-muted-foreground">{locale === "fr" ? "Total depense" : "مجموع المصاريف"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="bg-muted">
          <TabsTrigger value="orders" className="gap-1.5">
            <Package className="h-3.5 w-3.5" />
            {locale === "fr" ? "Commandes" : "الطلبات"}
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            {locale === "fr" ? "Profil" : "الملف الشخصي"}
          </TabsTrigger>
          <TabsTrigger value="addresses" className="gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {locale === "fr" ? "Adresses" : "العناوين"}
          </TabsTrigger>
        </TabsList>

        {/* Orders */}
        <TabsContent value="orders" className="mt-4">
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <Card className="border-border">
                <CardContent className="flex items-center justify-center p-8">
                  <p className="text-sm text-muted-foreground">
                    {locale === "fr" ? "Chargement..." : "جاري التحميل..."}
                  </p>
                </CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <Card className="border-border">
                <CardContent className="flex items-center justify-center p-8">
                  <p className="text-sm text-muted-foreground">
                    {locale === "fr" ? "Aucune commande trouvée" : "لا توجد طلبات"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`}>
                  <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-semibold text-foreground">{order.order_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString(locale === "fr" ? "fr-DZ" : "ar-DZ")} - {order.order_items?.length || 0} {locale === "fr" ? "article(s)" : "منتج(ات)"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-700"}>
                          {statusLabels[locale][order.status] || order.status}
                        </Badge>
                        <span className="text-sm font-bold text-foreground">{formatPrice(parseFloat(order.total_dzd))}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="mt-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">{locale === "fr" ? "Informations personnelles" : "المعلومات الشخصية"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-sm text-muted-foreground">
                    {locale === "fr" ? "Chargement..." : "جاري التحميل..."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">{locale === "fr" ? "Prenom" : "الاسم"}</Label>
                      <Input 
                        id="firstName"
                        name="firstName"
                        className="mt-1.5" 
                        defaultValue={profile?.first_name || ""} 
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{locale === "fr" ? "Nom" : "اللقب"}</Label>
                      <Input 
                        id="lastName"
                        name="lastName"
                        className="mt-1.5" 
                        defaultValue={profile?.last_name || ""}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      className="mt-1.5" 
                      defaultValue={profile?.email || ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{locale === "fr" ? "Telephone" : "الهاتف"}</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel"
                      className="mt-1.5" 
                      defaultValue={profile?.phone || ""}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-fit" disabled={isSavingProfile}>
                    {isSavingProfile 
                      ? (locale === "fr" ? "Sauvegarde..." : "جاري الحفظ...") 
                      : (locale === "fr" ? "Sauvegarder" : "حفظ")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses */}
        <TabsContent value="addresses" className="mt-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">{locale === "fr" ? "Mes adresses" : "عناويني"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-sm text-muted-foreground">
                    {locale === "fr" ? "Chargement..." : "جاري التحميل..."}
                  </p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-sm text-muted-foreground">
                    {locale === "fr" ? "Aucune adresse trouvée" : "لا توجد عناوين"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address, index) => (
                    <div key={index} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {address.firstName} {address.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{address.address}</p>
                          {address.stopDeskName && (
                            <p className="text-sm text-muted-foreground">
                              {locale === "fr" ? "Point relais: " : "نقطة التوصيل: "}{address.stopDeskName}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {locale === "fr" ? `Utilisée ${address.used_count} fois` : `استخدمت ${address.used_count} مرة`}
                          </p>
                        </div>
                        {index === 0 && (
                          <Badge className="bg-primary/10 text-primary">
                            {locale === "fr" ? "Récente" : "الأحدث"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <form action={logoutCustomer}>
          <Button type="submit" variant="outline" className="gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" />
            {locale === "fr" ? "Se deconnecter" : "تسجيل الخروج"}
          </Button>
        </form>
      </div>
    </div>
  )
}
