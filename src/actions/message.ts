"use server";

import { supabase } from "@/lib/supabase";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

export async function createMessage(message: string) {
    try {
        const studentIndex = await getSession();
        if (!studentIndex) return { error: "Unauthorized" };

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Check limit
        const { count, error: countError } = await supabase
            .from('StudentMessage')
            .select('*', { count: 'exact', head: true })
            .eq('studentIndex', studentIndex)
            .gte('createdAt', startOfDay.toISOString())
            .lte('createdAt', endOfDay.toISOString());

        if (countError) throw countError;

        if (count && count >= 2) {
            return { error: "Daily message limit reached (2 messages/day)." };
        }

        const { error: insertError } = await supabase
            .from('StudentMessage')
            .insert({
                studentIndex,
                message
            });

        if (insertError) throw insertError;

        revalidatePath("/dashboard/help");
        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: "Failed to send message" };
    }
}

export async function getStudentMessages() {
    try {
        const studentIndex = await getSession();
        if (!studentIndex) return [];

        const { data, error } = await supabase
            .from('StudentMessage')
            .select('*')
            .eq('studentIndex', studentIndex)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        return [];
    }
}

export async function getAdminMessages() {
    try {
        const { data, error } = await supabase
            .from('StudentMessage')
            .select('*, student:Student(firstName, lastName, indexNumber)')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        return [];
    }
}

export async function markMessageAsRead(id: string) {
    try {
        const { error } = await supabase
            .from('StudentMessage')
            .update({ isRead: true })
            .eq('id', id);
        
        if (error) throw error;
        revalidatePath("/admin/messages");
    } catch (error) {
        console.error(error);
    }
}

export async function markMessageAsReplied(id: string) {
    try {
        const { error } = await supabase
            .from('StudentMessage')
            .update({ isReplied: true, isRead: true })
            .eq('id', id);

        if (error) throw error;
        revalidatePath("/admin/messages");
    } catch (error) {
        console.error(error);
    }
}
