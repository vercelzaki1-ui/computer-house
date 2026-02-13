"use client"

import { useEffect, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Power,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  adminCanDeleteCategory,
  adminCreateCategory,
  adminDeleteCategory,
  adminGetCategoryTree,
  adminGetDepartments,
  adminMoveCategoryDown,
  adminMoveCategoryUp,
  adminSlugExists,
  adminToggleCategoryActive,
  adminUpdateCategory,
} from "@/app/admin/actions"

interface Department {
  id: string
  slug: string
  name_fr: string
  name_ar: string
}

interface CategoryNode {
  id: string
  name_fr: string
  name_ar: string
  slug: string
  parent_id: string | null
  department_id: string
  sort_order: number
  is_active: boolean
  children: CategoryNode[]
}

interface EditorState {
  name_fr: string
  name_ar: string
  slug: string
  sort_order: number
  is_active: boolean
}

function initialEditorState(): EditorState {
  return {
    name_fr: "",
    name_ar: "",
    slug: "",
    sort_order: 0,
    is_active: true,
  }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export default function CategoriesPage() {
  const { toast } = useToast()
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("")
  const [tree, setTree] = useState<CategoryNode[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create")
  const [editorParentId, setEditorParentId] = useState<string | null>(null)
  const [editorCategoryId, setEditorCategoryId] = useState<string | null>(null)
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<CategoryNode | null>(null)

  useEffect(() => {
    async function loadDepartments() {
      try {
        const rows = await adminGetDepartments()
        const departmentRows = Array.isArray(rows) ? rows : []
        setDepartments(departmentRows)
        if (departmentRows.length > 0) {
          setSelectedDepartmentId(departmentRows[0].id)
        }
      } catch (error) {
        console.error("Failed to load departments:", error)
      }
    }

    void loadDepartments()
  }, [])

  useEffect(() => {
    if (!selectedDepartmentId) return
    void refreshTree(selectedDepartmentId)
  }, [selectedDepartmentId])

  const refreshTree = async (departmentId = selectedDepartmentId) => {
    if (!departmentId) return
    setIsLoading(true)
    try {
      const rows = await adminGetCategoryTree(departmentId)
      const treeRows = Array.isArray(rows) ? rows : []
      setTree(treeRows)
      setExpandedIds(new Set(treeRows.map((node) => node.id)))
    } catch (error) {
      console.error("Failed to load category tree:", error)
      setTree([])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpanded = (categoryId: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const openCreateDialog = (parentId: string | null) => {
    setEditorMode("create")
    setEditorParentId(parentId)
    setEditorCategoryId(null)
    setEditorState(initialEditorState())
    setEditorOpen(true)
  }

  const openEditDialog = (category: CategoryNode) => {
    setEditorMode("edit")
    setEditorParentId(category.parent_id)
    setEditorCategoryId(category.id)
    setEditorState({
      name_fr: category.name_fr,
      name_ar: category.name_ar,
      slug: category.slug,
      sort_order: category.sort_order || 0,
      is_active: category.is_active,
    })
    setEditorOpen(true)
  }

  const handleSave = async () => {
    if (!selectedDepartmentId) return
    if (!editorState.name_fr.trim() || !editorState.name_ar.trim() || !editorState.slug.trim()) {
      toast({
        variant: "destructive",
        title: "Validation",
        description: "name_fr, name_ar et slug sont obligatoires.",
      })
      return
    }

    setIsSaving(true)

    try {
      const normalizedSlug = slugify(editorState.slug)
      const slugExists = await adminSlugExists(
        normalizedSlug,
        selectedDepartmentId,
        editorMode === "edit" ? editorCategoryId || undefined : undefined
      )

      if (slugExists) {
        toast({
          variant: "destructive",
          title: "Slug deja utilise",
          description: "Ce slug existe deja dans ce departement.",
        })
        return
      }

      if (editorMode === "create") {
        const result = await adminCreateCategory({
          department_id: selectedDepartmentId,
          parent_id: editorParentId,
          name_fr: editorState.name_fr.trim(),
          name_ar: editorState.name_ar.trim(),
          slug: normalizedSlug,
          sort_order: Number(editorState.sort_order) || 0,
          is_active: editorState.is_active,
        })

        if (result && typeof result === "object" && "error" in result) {
          throw new Error(String(result.error))
        }
      } else if (editorCategoryId) {
        const result = await adminUpdateCategory(editorCategoryId, {
          name_fr: editorState.name_fr.trim(),
          name_ar: editorState.name_ar.trim(),
          slug: normalizedSlug,
          sort_order: Number(editorState.sort_order) || 0,
          is_active: editorState.is_active,
        })

        if (result && typeof result === "object" && "error" in result) {
          throw new Error(String(result.error))
        }
      }

      setEditorOpen(false)
      await refreshTree()
      toast({
        title: editorMode === "create" ? "Categorie creee" : "Categorie mise a jour",
        description: "La taxonomie a ete actualisee.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de sauvegarder la categorie.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (category: CategoryNode) => {
    setIsSaving(true)
    try {
      const result = await adminToggleCategoryActive(category.id, !category.is_active)
      if (result && typeof result === "object" && "error" in result) {
        throw new Error(String(result.error))
      }
      await refreshTree()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de changer l'etat de la categorie.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleMove = async (categoryId: string, direction: "up" | "down") => {
    setIsSaving(true)
    try {
      const result =
        direction === "up"
          ? await adminMoveCategoryUp(categoryId)
          : await adminMoveCategoryDown(categoryId)
      if (result && typeof result === "object" && "error" in result) {
        throw new Error(String(result.error))
      }
      await refreshTree()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de reordonner la categorie.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const requestDelete = (category: CategoryNode) => {
    setDeleteTarget(category)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setIsSaving(true)
    try {
      const check = await adminCanDeleteCategory(deleteTarget.id)
      if (!check || typeof check !== "object" || !("can" in check)) {
        throw new Error("Verification de suppression impossible.")
      }

      if (!check.can) {
        toast({
          variant: "destructive",
          title: "Suppression bloquee",
          description: check.reason || "Cette categorie ne peut pas etre supprimee.",
        })
        setDeleteOpen(false)
        setDeleteTarget(null)
        return
      }

      const result = await adminDeleteCategory(deleteTarget.id)
      if (result && typeof result === "object" && "error" in result) {
        throw new Error(String(result.error))
      }

      setDeleteOpen(false)
      setDeleteTarget(null)
      await refreshTree()
      toast({
        title: "Categorie supprimee",
        description: "La categorie a ete supprimee.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de supprimer la categorie.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderNode = (node: CategoryNode, level: number) => {
    const isExpanded = expandedIds.has(node.id)
    const canHaveChild = level < 2
    const hasChildren = node.children.length > 0

    return (
      <div key={node.id} className="space-y-1">
        <div
          className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${
            node.is_active ? "border-border bg-card" : "border-border bg-muted/40"
          }`}
          style={{ marginLeft: `${level * 16}px` }}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-7 w-7"
              onClick={() => toggleExpanded(node.id)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : (
            <div className="w-7" />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{node.name_fr}</p>
            <p className="truncate text-xs text-muted-foreground">/{node.slug}</p>
          </div>

          {!node.is_active && <Badge variant="outline">Inactif</Badge>}

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-7 w-7"
              disabled={!canHaveChild || isSaving}
              title={canHaveChild ? "Ajouter un enfant" : "Niveau maximum atteint (3 niveaux)"}
              onClick={() => openCreateDialog(node.id)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-7 w-7"
              disabled={isSaving}
              onClick={() => openEditDialog(node)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-7 w-7"
              disabled={isSaving}
              onClick={() => handleToggleActive(node)}
            >
              <Power className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-7 w-7"
              disabled={isSaving}
              onClick={() => handleMove(node.id, "up")}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-7 w-7"
              disabled={isSaving}
              onClick={() => handleMove(node.id, "down")}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-7 w-7 text-destructive"
              disabled={isSaving}
              onClick={() => requestDelete(node)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">{node.children.map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Administrez la taxonomie par departement (niveaux 1 a 3).
          </p>
        </div>
        <Button type="button" onClick={() => openCreateDialog(null)} disabled={!selectedDepartmentId || isSaving}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une categorie racine
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Arbre des categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm">
            <Label>Departement</Label>
            <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId} disabled={isSaving}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Selectionner un departement" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name_fr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-[92%]" />
              <Skeleton className="h-12 w-[84%]" />
            </div>
          ) : tree.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
              Aucune categorie dans ce departement. Utilisez le bouton ci-dessus pour creer la premiere categorie.
            </div>
          ) : (
            <div className="space-y-2">{tree.map((node) => renderNode(node, 0))}</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editorMode === "create" ? "Ajouter une categorie" : "Modifier la categorie"}</DialogTitle>
            <DialogDescription>
              {editorMode === "create"
                ? editorParentId
                  ? "Cette categorie sera creee comme enfant."
                  : "Cette categorie sera creee a la racine."
                : "Mettez a jour les informations puis enregistrez."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>name_fr</Label>
              <Input
                className="mt-1.5"
                value={editorState.name_fr}
                onChange={(event) =>
                  setEditorState((previous) => {
                    const value = event.target.value
                    return {
                      ...previous,
                      name_fr: value,
                      slug: previous.slug ? previous.slug : slugify(value),
                    }
                  })
                }
              />
            </div>
            <div>
              <Label>name_ar</Label>
              <Input
                className="mt-1.5"
                dir="rtl"
                value={editorState.name_ar}
                onChange={(event) => setEditorState((previous) => ({ ...previous, name_ar: event.target.value }))}
              />
            </div>
            <div>
              <Label>slug</Label>
              <Input
                className="mt-1.5"
                value={editorState.slug}
                onChange={(event) => setEditorState((previous) => ({ ...previous, slug: event.target.value }))}
              />
            </div>
            <div>
              <Label>sort_order</Label>
              <Input
                className="mt-1.5"
                type="number"
                value={editorState.sort_order}
                onChange={(event) =>
                  setEditorState((previous) => ({
                    ...previous,
                    sort_order: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">is_active</p>
                <p className="text-xs text-muted-foreground">Desactivez pour masquer sans supprimer.</p>
              </div>
              <Button
                type="button"
                variant={editorState.is_active ? "default" : "outline"}
                onClick={() => setEditorState((previous) => ({ ...previous, is_active: !previous.is_active }))}
              >
                {editorState.is_active ? "Actif" : "Inactif"}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditorOpen(false)} disabled={isSaving}>
              Annuler
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la categorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              La suppression est bloquee si la categorie contient des enfants ou des produits. Pour un retrait sans
              risque, utilisez plutot Disable/Enable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isSaving && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-sm">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          Mise a jour en cours...
        </div>
      )}
    </div>
  )
}
