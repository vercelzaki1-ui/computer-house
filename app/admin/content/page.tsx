"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, GripVertical, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getMarqueeBrandsAdmin,
  getAllBrands,
  addBrandToMarquee,
  removeBrandFromMarquee,
  toggleMarqueeBrandActive,
} from "@/app/admin/content/actions"
import { toast } from "sonner"

type MarqueeBrand = {
  id: string
  brand_id: string
  logo_url: string
  sort_order: number
  is_active: boolean
  brands: {
    id: string
    name: string
    slug: string
    logo_url: string | null
  }
}

type Brand = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  is_active: boolean
}

export default function AdminContentPage() {
  const [marqueeBrands, setMarqueeBrands] = useState<MarqueeBrand[]>([])
  const [allBrands, setAllBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedBrandId, setSelectedBrandId] = useState("")
  const [logoUrl, setLogoUrl] = useState("")

  const loadData = async () => {
    setLoading(true)
    try {
      const [marqueeData, brandsData] = await Promise.all([
        getMarqueeBrandsAdmin(),
        getAllBrands(),
      ])
      setMarqueeBrands(marqueeData)
      setAllBrands(brandsData)
    } catch (error) {
      console.error("Failed to load data:", error)
      toast.error("Échec du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddBrand = async () => {
    if (!selectedBrandId) {
      toast.error("Veuillez sélectionner une marque")
      return
    }

    const brand = allBrands.find((b) => b.id === selectedBrandId)
    if (!brand) return

    const finalLogoUrl = logoUrl || brand.logo_url || ""

    const result = await addBrandToMarquee(selectedBrandId, finalLogoUrl)
    if (result.error) {
      toast.error("Échec de l'ajout de la marque")
    } else {
      toast.success("Marque ajoutée avec succès")
      setIsDialogOpen(false)
      setSelectedBrandId("")
      setLogoUrl("")
      loadData()
    }
  }

  const handleRemoveBrand = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer cette marque du marquee?")) return

    const result = await removeBrandFromMarquee(id)
    if (result.error) {
      toast.error("Échec de la suppression")
    } else {
      toast.success("Marque retirée avec succès")
      loadData()
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const result = await toggleMarqueeBrandActive(id, !isActive)
    if (result.error) {
      toast.error("Échec de la mise à jour")
    } else {
      toast.success("Statut mis à jour")
      loadData()
    }
  }

  // Filter out brands that are already in marquee
  const availableBrands = allBrands.filter(
    (brand) => !marqueeBrands.some((mb) => mb.brand_id === brand.id)
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Gestion des marques
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez les marques affichées dans le bandeau défilant du site
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Marques dans le marquee</CardTitle>
              <CardDescription>
                {marqueeBrands.length} marque{marqueeBrands.length !== 1 ? "s" : ""} configurée
                {marqueeBrands.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter une marque
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une marque au marquee</DialogTitle>
                  <DialogDescription>
                    Sélectionnez une marque à ajouter au bandeau défilant
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Marque</Label>
                    <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une marque" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBrands.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            Toutes les marques sont déjà ajoutées
                          </div>
                        ) : (
                          availableBrands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>URL du logo (optionnel)</Label>
                    <Input
                      placeholder="https://..."
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Laissez vide pour utiliser le logo par défaut de la marque
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddBrand} disabled={!selectedBrandId}>
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
          ) : marqueeBrands.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">
                Aucune marque configurée
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsDialogOpen(true)}
              >
                Ajouter la première marque
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {marqueeBrands.map((marqueeBrand) => (
                <Card key={marqueeBrand.id} className="border-border">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                      <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-border bg-white p-2">
                        {marqueeBrand.logo_url || marqueeBrand.brands.logo_url ? (
                          <img
                            src={marqueeBrand.logo_url || marqueeBrand.brands.logo_url!}
                            alt={marqueeBrand.brands.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {marqueeBrand.brands.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Position: {marqueeBrand.sort_order + 1}
                        </p>
                        {marqueeBrand.is_active ? (
                          <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="mt-1 bg-gray-100 text-gray-800 text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={marqueeBrand.is_active}
                        onCheckedChange={() =>
                          handleToggleActive(marqueeBrand.id, marqueeBrand.is_active)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemoveBrand(marqueeBrand.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
