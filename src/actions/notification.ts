"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createNotification(data: {
    studentIndex: string;
    message: string;
    type: 'WARNING' | 'PAYMENT' | 'INFO';
}) {
    try {
        // Verify student exists first
        const { data: student, error: checkError } = await supabase
            .from('Student')
            .select('id')
            .eq('indexNumber', data.studentIndex)
            .single();

        if (!student) {
            return { error: "Student not found with that Index Number." };
        }

        const { error } = await supabase
            .from('Notification')
            .insert({
                studentIndex: data.studentIndex,
                message: data.message,
                type: data.type
            });
        
        if (error) throw error;

        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error) {
        console.error("Create Notification Error:", error);
        return { error: "Failed to send notification." };
    }
}

export async function getStudentNotifications(studentIndex: string) {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        // Auto-delete old notifications
        await supabase
            .from('Notification')
            .delete()
            .eq('studentIndex', studentIndex)
            .lt('createdAt', threeDaysAgo.toISOString());

        const { data, error } = await supabase
            .from('Notification')
            .select('*')
            .eq('studentIndex', studentIndex)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Get Notifications Error:", error);
        // Retry fetch without cleanup if cleanup failed
        try {
            const { data } = await supabase
                .from('Notification')
                .select('*')
                .eq('studentIndex', studentIndex)
                .order('createdAt', { ascending: false });
            return data || [];
        } catch (e) {
            return [];
        }
    }
}

export async function markNotificationAsRead(id: string) {
    try {
        const { error } = await supabase
            .from('Notification')
            .update({ isRead: true })
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Mark Read Error:", error);
        return { error: "Failed to mark as read." };
    }
}

export async function deleteNotification(id: string) {
    try {
        const { error } = await supabase
            .from('Notification')
            .delete()
            .eq('id', id);
        if (error) throw error;
        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error) {
         console.error("Delete Notification Error:", error);
        return { error: "Failed to delete notification." };
    }
}
