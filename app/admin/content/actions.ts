'use server';

import * as repo from '@/lib/repositories';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getMarqueeBrandsAdmin() {
  try {
    const { data, error } = await supabaseAdmin
      .from('marquee_brands')
      .select(`
        *,
        brands(id, name, slug, logo_url)
      `)
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Failed to get marquee brands:', error);
    return [];
  }
}

export async function getAllBrands() {
  try {
    return await repo.getBrands(false);
  } catch (error: any) {
    console.error('Failed to get brands:', error);
    return [];
  }
}

export async function addBrandToMarquee(brandId: string, logoUrl: string) {
  try {
    // Get current count for sort_order
    const existing = await getMarqueeBrandsAdmin();
    const sortOrder = existing.length;

    await repo.createMarqueeBrand({
      brand_id: brandId,
      logo_url: logoUrl,
      sort_order: sortOrder,
      is_active: true,
    });

    revalidatePath('/admin/content');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to add brand to marquee:', error);
    return { error: error.message };
  }
}

export async function removeBrandFromMarquee(id: string) {
  try {
    await repo.deleteMarqueeBrand(id);
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to remove brand from marquee:', error);
    return { error: error.message };
  }
}

export async function updateMarqueeBrandOrder(id: string, sortOrder: number) {
  try {
    await repo.updateMarqueeBrand(id, { sort_order: sortOrder });
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update brand order:', error);
    return { error: error.message };
  }
}

export async function toggleMarqueeBrandActive(id: string, isActive: boolean) {
  try {
    await repo.updateMarqueeBrand(id, { is_active: isActive });
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to toggle brand active:', error);
    return { error: error.message };
  }
}
