"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Normalizes a date to UTC midnight (00:00:00.000Z)
 */
function normalizeToUTC(dateInput: string | Date) {
    const date = new Date(dateInput);
    // If it's a date string like "2024-05-20", new Date() often treats as UTC.
    // If it's a full ISO string, we want to clear the time part.
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString();
}

export async function getAdminPerformance() {
  try {
    const { data, error } = await supabase
      .from('DailyWorkTime')
      .select('*, student:Student(indexNumber, firstName, lastName, email)')
      .order('weekStartDate', { ascending: false });

    if (error) throw error;
    
    // Ensure student is an object, not an array
    const mappedData = (data || []).map((record: any) => ({
        ...record,
        student: Array.isArray(record.student) ? record.student[0] : record.student
    }));

    return mappedData;
  } catch (error) {
    console.error("Get Performance Error:", error);
    return [];
  }
}

export async function searchStudents(query: string) {
    if (!query) return [];
    try {
        const { data, error } = await supabase
            .from('Student')
            .select('indexNumber, firstName, lastName')
            .or(`firstName.ilike.%${query}%,lastName.ilike.%${query}%,indexNumber.ilike.%${query}%`)
            .limit(5);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Search Student Error:", error);
        return [];
    }
}


export async function createDailyPerformance(data: any) {
  try {
    const weekStartDate = normalizeToUTC(data.weekStartDate);
    
    // Check if record exists
    const { data: existing, error: checkError } = await supabase
        .from('DailyWorkTime')
        .select('id')
        .eq('studentIndex', data.studentIndex)
        .eq('weekStartDate', weekStartDate)
        .maybeSingle();

    if (existing) {
        return { error: "Record already exists for this student and week." };
    }

    const { error: insertError } = await supabase
      .from('DailyWorkTime')
      .insert({
        studentIndex: data.studentIndex,
        weekStartDate: weekStartDate,
        monday: parseFloat(data.monday) || 0,
        tuesday: parseFloat(data.tuesday) || 0,
        wednesday: parseFloat(data.wednesday) || 0,
        thursday: parseFloat(data.thursday) || 0,
        friday: parseFloat(data.friday) || 0,
        saturday: parseFloat(data.saturday) || 0,
        sunday: parseFloat(data.sunday) || 0,
      });

    if (insertError) {
      if (insertError.code === '23503') return { error: "Invalid Student Index." };
      throw insertError;
    }

    revalidatePath("/admin/performance");
    return { success: true };
  } catch (error: any) {
    console.error("Create Performance Error:", error);
    return { error: "Failed to create record." };
  }
}

export async function updateDailyPerformance(id: string, data: any) {
  try {
    const { error } = await supabase
      .from('DailyWorkTime')
      .update({
        monday: parseFloat(data.monday) || 0,
        tuesday: parseFloat(data.tuesday) || 0,
        wednesday: parseFloat(data.wednesday) || 0,
        thursday: parseFloat(data.thursday) || 0,
        friday: parseFloat(data.friday) || 0,
        saturday: parseFloat(data.saturday) || 0,
        sunday: parseFloat(data.sunday) || 0,
      })
      .eq('id', id);

    if (error) throw error;

    revalidatePath("/admin/performance");
    return { success: true };
  } catch (error) {
    console.error("Update Performance Error:", error);
    return { error: "Failed to update record." };
  }
}

export async function deleteDailyPerformance(id: string) {
  try {
    const { error } = await supabase
      .from('DailyWorkTime')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath("/admin/performance");
    return { success: true };
  } catch (error) {
    console.error("Delete Performance Error:", error);
    return { error: "Failed to delete record." };
  }
}
