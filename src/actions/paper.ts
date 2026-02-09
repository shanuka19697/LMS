"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Get All Admin Papers
export async function getAdminPapers() {
  try {
    const { data: papers, error } = await supabase
      .from('Paper')
      .select('*, marks:PaperMark(count)')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    
    return (papers || []).map(p => ({
        ...p,
        _count: {
            marks: p.marks?.[0]?.count || 0
        }
    }));
  } catch (error) {
    console.error("Get Papers Error:", error);
    return [];
  }
}

// Get Active Papers (for Dropdowns)
export async function getActivePapers() {
    try {
        const { data, error } = await supabase
            .from('Paper')
            .select('*')
            .eq('isActive', true)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Get Active Papers Error:", error);
        return [];
    }
}

// Search Papers (for Combobox)
export async function searchPapers(query: string) {
    try {
        const { data, error } = await supabase
            .from('Paper')
            .select('*')
            .eq('isActive', true)
            .ilike('title', `%${query}%`)
            .limit(10)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Search Papers Error:", error);
        return [];
    }
}

// Create Paper
export async function createAdminPaper(data: any) {
  try {
    const { error } = await supabase
      .from('Paper')
      .insert({
        title: data.title,
        examYear: data.examYear,
        type: data.type,
        isActive: data.isActive === 'true' || data.isActive === true
      });

    if (error) throw error;

    revalidatePath("/admin/papers");
    revalidatePath("/admin/paper-marks"); 
    return { success: true };
  } catch (error) {
    console.error("Create Paper Error:", error);
    return { error: "Failed to create paper." };
  }
}

// Update Paper Status
export async function updatePaperStatus(id: string, isActive: boolean) {
    try {
        const { error } = await supabase
            .from('Paper')
            .update({ isActive })
            .eq('id', id);

        if (error) throw error;

        revalidatePath("/admin/papers");
        revalidatePath("/admin/paper-marks");
        return { success: true };
    } catch (error) {
        console.error("Update Status Error:", error);
        return { error: "Failed to update paper status." };
    }
}

// Update Paper Details
export async function updateAdminPaper(id: string, data: any) {
    try {
        const { error } = await supabase
            .from('Paper')
            .update({
                title: data.title,
                examYear: data.examYear,
                type: data.type,
                isActive: data.isActive === 'true' || data.isActive === true
            })
            .eq('id', id);

        if (error) throw error;

        revalidatePath("/admin/papers");
        revalidatePath("/admin/paper-marks");
        return { success: true };
    } catch (error) {
        console.error("Update Paper Error:", error);
        return { error: "Failed to update paper details." };
    }
}

// Delete Paper
export async function deleteAdminPaper(id: string) {
  try {
    const { error } = await supabase
      .from('Paper')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath("/admin/papers");
    return { success: true };
  } catch (error) {
    console.error("Delete Paper Error:", error);
    return { error: "Failed to delete paper." };
  }
}
