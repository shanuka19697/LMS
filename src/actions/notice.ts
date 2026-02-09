"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createNotice(data: any) {
    try {
        const { error } = await supabase
            .from('Notice')
            .insert({
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl || null,
                link: data.link || null,
                examYear: data.examYear,
                isActive: data.isActive === 'true' || data.isActive === true
            });
        
        if (error) throw error;
        revalidatePath("/admin/notices");
        return { success: true };
    } catch (error) {
        console.error("Create Notice Error:", error);
        return { error: "Failed to create notice." };
    }
}

export async function updateNotice(id: string, data: any) {
    try {
        const { error } = await supabase
            .from('Notice')
            .update({
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl || null,
                link: data.link || null,
                examYear: data.examYear,
                isActive: data.isActive === 'true' || data.isActive === true
            })
            .eq('id', id);

        if (error) throw error;
        revalidatePath("/admin/notices");
        return { success: true };
    } catch (error) {
        console.error("Update Notice Error:", error);
        return { error: "Failed to update notice." };
    }
}

export async function deleteNotice(id: string) {
    try {
        const { error } = await supabase
            .from('Notice')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        revalidatePath("/admin/notices");
        return { success: true };
    } catch (error) {
        console.error("Delete Notice Error:", error);
        return { error: "Failed to delete notice." };
    }
}

export async function getAdminNotices() {
    try {
        const { data, error } = await supabase
            .from('Notice')
            .select('*')
            .order('createdAt', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Get Admin Notices Error:", error);
        return [];
    }
}

export async function getStudentNotices(examYear: string) {
    try {
        const { data, error } = await supabase
            .from('Notice')
            .select('*')
            .eq('examYear', examYear)
            .eq('isActive', true)
            .order('createdAt', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Get Student Notices Error:", error);
        return [];
    }
}
