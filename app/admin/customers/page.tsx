"use client"

import { useState } from "react"
import { Search, Users, Mail, Phone, MapPin, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/data"

const customers = [
  { id: "c1", name: "Mohamed Benali", email: "m.benali@email.com", phone: "0550123456", wilaya: "Alger", orders: 5, totalSpent: 482000, joinDate: "15 Jan 2025", lastOrder: "12 Feb 2026" },
  { id: "c2", name: "Amina Khelifi", email: "a.khelifi@email.com", phone: "0661234567", wilaya: "Oran", orders: 3, totalSpent: 167000, joinDate: "22 Mar 2025", lastOrder: "12 Feb 2026" },
  { id: "c3", name: "Yacine Djellal", email: "y.djellal@email.com", phone: "0772345678", wilaya: "Constantine", orders: 8, totalSpent: 735000, joinDate: "05 Nov 2024", lastOrder: "11 Feb 2026" },
  { id: "c4", name: "Sarah Mansouri", email: "s.mansouri@email.com", phone: "0553456789", wilaya: "Setif", orders: 2, totalSpent: 57000, joinDate: "10 Aug 2025", lastOrder: "11 Feb 2026" },
  { id: "c5", name: "Karim Laoufi", email: "k.laoufi@email.com", phone: "0664567890", wilaya: "Blida", orders: 6, totalSpent: 523000, joinDate: "01 Jun 2024", lastOrder: "10 Feb 2026" },
  { id: "c6", name: "Nadia Touati", email: "n.touati@email.com", phone: "0775678901", wilaya: "Tizi Ouzou", orders: 4, totalSpent: 298000, joinDate: "18 Dec 2024", lastOrder: "10 Feb 2026" },
  { id: "c7", name: "Ali Benmoussa", email: "a.benmoussa@email.com", phone: "0556789012", wilaya: "Annaba", orders: 7, totalSpent: 612000, joinDate: "03 Feb 2025", lastOrder: "09 Feb 2026" },
  { id: "c8", name: "Fatima Zerrouki", email: "f.zerrouki@email.com", phone: "0667890123", wilaya: "Medea", orders: 1, totalSpent: 18500, joinDate: "28 Jan 2026", lastOrder: "08 Feb 2026" },
]

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("")

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.wilaya.toLowerCase().includes(q)
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">{customers.length} clients enregistres</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wilaya</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commandes</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total depense</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">Derniere commande</th>
                <th className="px-4 py-3 text-end text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {customer.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{customer.wilaya}</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-primary/10 text-primary">{customer.orders}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{customer.lastOrder}</td>
                  <td className="px-4 py-3 text-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1.5 text-primary">
                          <Users className="h-3.5 w-3.5" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-heading">{customer.name}</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 pt-2">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 text-primary" /> {customer.email}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 text-primary" /> {customer.phone}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" /> {customer.wilaya}
                          </div>
                          <Separator />
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="rounded-lg bg-muted p-3">
                              <p className="text-lg font-bold text-foreground">{customer.orders}</p>
                              <p className="text-xs text-muted-foreground">Commandes</p>
                            </div>
                            <div className="rounded-lg bg-muted p-3">
                              <p className="text-lg font-bold text-foreground">{formatPrice(customer.totalSpent)}</p>
                              <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                            <div className="rounded-lg bg-muted p-3">
                              <p className="text-sm font-bold text-foreground">{customer.joinDate}</p>
                              <p className="text-xs text-muted-foreground">Inscrit</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
