"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification";

export async function getAdminPurchases() {
  try {
    const { data: purchases, error } = await supabase
      .from('LessonPurchase')
      .select('*, student:Student(indexNumber, firstName, lastName, email), lesson:LessonPack(name, price)')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return purchases || [];
  } catch (error) {
    console.error("Get Purchases Error:", error);
    return [];
  }
}

export async function updatePurchaseStatus(id: string, status: string, rejectionReason?: string) {
  try {
    // 1. Get purchase details first to send notification
    const { data: purchase, error: fetchError } = await supabase
      .from('LessonPurchase')
      .select('*, lesson:LessonPack(name), studentIndex')
      .eq('id', id)
      .single();

    if (fetchError || !purchase) throw new Error("Purchase not found");

    // 2. Update status and rejectionReason
    const { error } = await supabase
      .from('LessonPurchase')
      .update({ 
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null
      })
      .eq('id', id);

    if (error) throw error;

    // 3. Create notification for the student
    let notificationMessage = "";
    if (status === 'APPROVED') {
      notificationMessage = `Your enrollment for ${purchase.lesson.name} has been approved! You can now access the classroom.`;
    } else if (status === 'REJECTED') {
      notificationMessage = `Your enrollment for ${purchase.lesson.name} was rejected. Reason: ${rejectionReason || 'No reason provided'}. Please re-upload a valid slip.`;
    }

    if (notificationMessage) {
      await createNotification({
        studentIndex: purchase.studentIndex,
        message: notificationMessage,
        type: status === 'APPROVED' ? 'INFO' : 'WARNING'
      });
    }

    revalidatePath("/admin/sales");
    revalidatePath("/dashboard/lesson-store");
    revalidatePath(`/dashboard/lesson-store/${purchase.lessonId}`);
    return { success: true };
  } catch (error) {
    console.error("Update Status Error:", error);
    return { error: "Failed to update status." };
  }
}

export async function deletePurchase(id: string) {
  try {
    const { error } = await supabase
      .from('LessonPurchase')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath("/admin/sales");
    return { success: true };
  } catch (error) {
    console.error("Delete Purchase Error:", error);
    return { error: "Failed to delete purchase." };
  }
}
