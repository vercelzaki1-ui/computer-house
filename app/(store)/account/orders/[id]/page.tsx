'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, CreditCard, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/lib/locale-context';
import { formatPrice } from '@/lib/data';
import { getOrderById } from '@/app/(store)/actions';

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusLabels: Record<string, Record<string, string>> = {
  fr: {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  },
  ar: {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغى',
  },
};

const paymentMethodLabels: Record<string, Record<string, string>> = {
  fr: {
    cash: 'Paiement à la livraison',
    bank_transfer: 'Virement bancaire',
  },
  ar: {
    cash: 'الدفع عند الاستلام',
    bank_transfer: 'تحويل بنكي',
  },
};

const deliveryMethodLabels: Record<string, Record<string, string>> = {
  fr: {
    home: 'Livraison à domicile',
    desk: 'Point relais',
  },
  ar: {
    home: 'التوصيل للمنزل',
    desk: 'نقطة التوصيل',
  },
};

export default function CustomerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);
  const { locale } = useLocale();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      try {
        const result = await getOrderById(orderId);
        console.log('📦 Customer Order Detail - Order:', result);
        setOrder(result);
      } catch (error) {
        console.error('Failed to load order:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            {locale === 'fr' ? 'Commande introuvable' : 'الطلبية غير موجودة'}
          </p>
          <Link href="/account">
            <Button variant="outline" className="mt-4">
              {locale === 'fr' ? 'Retour au compte' : 'العودة للحساب'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <Link href="/account">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          {locale === 'fr' ? 'Retour au compte' : 'العودة للحساب'}
        </Button>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString(locale === 'fr' ? 'fr-DZ' : 'ar-DZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : locale === 'fr' ? 'Date inconnue' : 'تاريخ غير معروف'}
          </p>
        </div>
        <Badge className={`${statusColors[order.status] || statusColors.pending} text-sm`}>
          {statusLabels[locale][order.status] || order.status}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {locale === 'fr' ? 'Résumé de la commande' : 'ملخص الطلبية'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'fr' ? 'Méthode de paiement' : 'طريقة الدفع'}
                  </p>
                  <p className="text-sm font-semibold">
                    {paymentMethodLabels[locale][order.payment_method] || order.payment_method}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'fr' ? 'Mode de livraison' : 'طريقة التوصيل'}
                  </p>
                  <p className="text-sm font-semibold">
                    {deliveryMethodLabels[locale][order.delivery_method] || order.delivery_method}
                  </p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'fr' ? 'Sous-total' : 'المجموع الفرعي'}
                </p>
                <p className="text-sm font-semibold">{formatPrice(parseFloat(order.subtotal_dzd) || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'fr' ? 'Livraison' : 'التوصيل'}
                </p>
                <p className="text-sm font-semibold">{formatPrice(parseFloat(order.shipping_dzd) || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{locale === 'fr' ? 'Total' : 'المجموع'}</p>
                <p className="text-lg font-bold">{formatPrice(parseFloat(order.total_dzd) || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{locale === 'fr' ? 'Articles' : 'المنتجات'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{item.title_snapshot}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.qty} × {formatPrice(parseFloat(item.unit_price_dzd))}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(parseFloat(item.line_total_dzd))}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {locale === 'fr' ? 'Adresse de livraison' : 'عنوان التوصيل'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.address_snapshot ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'fr' ? 'Nom complet' : 'الاسم الكامل'}
                    </p>
                    <p className="font-medium">
                      {order.address_snapshot.firstName} {order.address_snapshot.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'fr' ? 'Adresse' : 'العنوان'}
                    </p>
                    <p className="font-medium">{order.address_snapshot.address}</p>
                    {order.address_snapshot.stopDeskName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {locale === 'fr' ? 'Point relais: ' : 'نقطة التوصيل: '}
                        {order.address_snapshot.stopDeskName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'fr' ? 'Téléphone' : 'الهاتف'}
                    </p>
                    <p className="font-medium">{order.address_snapshot.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {locale === 'fr' ? "Pas d'adresse disponible" : 'لا يوجد عنوان'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
