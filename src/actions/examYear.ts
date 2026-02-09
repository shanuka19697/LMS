"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getExamYears(activeOnly = false) {
  try {
    let query = supabase
      .from('ExamYear')
      .select('*')
      .order('year', { ascending: true });
    
    if (activeOnly) {
        query = query.eq('isActive', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get Exam Years Error:", error);
    return [];
  }
}

export async function createExamYear(year: string) {
  try {
    const { error } = await supabase
      .from('ExamYear')
      .insert({
        year,
        isActive: true
      });

    if (error) {
      if (error.code === '23505') return { error: "Year already exists." };
      throw error;
    }

    revalidatePath("/admin/exam-years");
    return { success: true };
  } catch (error: any) {
    console.error("Create Exam Year Error:", error);
    return { error: "Failed to create exam year." };
  }
}

export async function toggleExamYear(id: string, isActive: boolean) {
  try {
    const { error } = await supabase
      .from('ExamYear')
      .update({ isActive })
      .eq('id', id);

    if (error) throw error;
    revalidatePath("/admin/exam-years");
    return { success: true };
  } catch (error) {
    console.error("Toggle Exam Year Error:", error);
    return { error: "Failed to update status." };
  }
}

export async function deleteExamYear(id: string) {
  try {
    const { error } = await supabase
      .from('ExamYear')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath("/admin/exam-years");
    return { success: true };
  } catch (error) {
    console.error("Delete Exam Year Error:", error);
    return { error: "Failed to delete exam year." };
  }
}
