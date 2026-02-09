"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getAdminMarks() {
  try {
    const { data: marks, error } = await supabase
      .from('PaperMark')
      .select('*, student:Student(firstName, lastName), paper:Paper(*)')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return marks || [];
  } catch (error) {
    console.error("Get Marks Error:", error);
    return [];
  }
}

export async function createAdminMark(data: any) {
  try {
    const { data: student, error: studentError } = await supabase
        .from('Student')
        .select('id')
        .eq('indexNumber', data.studentIndex)
        .single();

    if (studentError || !student) return { error: "Student not found with this Index Number." };

    const { data: paper, error: paperError } = await supabase
        .from('Paper')
        .select('*')
        .eq('id', data.paperId)
        .single();

    if (paperError || !paper) return { error: "Paper not found." };

    const firstMark = parseFloat(data.firstMark || 0);
    const secondMark = paper.type === 'TIMING' ? 0 : parseFloat(data.secondMark || 0);
    const totalMark = data.totalMark ? parseFloat(data.totalMark) : (firstMark + secondMark);

    const { error: insertError } = await supabase
      .from('PaperMark')
      .insert({
        studentIndex: data.studentIndex,
        paperId: data.paperId,
        type: paper.type,
        firstMark: paper.type === 'TIMING' ? null : firstMark,
        secondMark: paper.type === 'TIMING' ? null : secondMark,
        totalMark: totalMark,
      });

    if (insertError) throw insertError;

    revalidatePath("/admin/paper-marks");
    return { success: true };
  } catch (error) {
    console.error("Create Mark Error:", error);
    return { error: "Failed to add paper mark." };
  }
}

export async function updateAdminMark(id: string, data: any) {
    try {
        const { data: student, error: studentError } = await supabase
            .from('Student')
            .select('id')
            .eq('indexNumber', data.studentIndex)
            .single();

        if (studentError || !student) return { error: "Student not found with this Index Number." };

        const { data: paper, error: paperError } = await supabase
            .from('Paper')
            .select('*')
            .eq('id', data.paperId)
            .single();

        if (paperError || !paper) return { error: "Paper not found." };

        const firstMark = parseFloat(data.firstMark || 0);
        const secondMark = paper.type === 'TIMING' ? 0 : parseFloat(data.secondMark || 0);
        const totalMark = data.totalMark ? parseFloat(data.totalMark) : (firstMark + secondMark);

        const { error: updateError } = await supabase
            .from('PaperMark')
            .update({
                studentIndex: data.studentIndex,
                paperId: data.paperId,
                type: paper.type,
                firstMark: paper.type === 'TIMING' ? null : firstMark,
                secondMark: paper.type === 'TIMING' ? null : secondMark,
                totalMark: totalMark,
            })
            .eq('id', id);

        if (updateError) throw updateError;

        revalidatePath("/admin/paper-marks");
        return { success: true };
    } catch (error) {
        console.error("Update Mark Error:", error);
        return { error: "Failed to update paper mark." };
    }
}

export async function deleteAdminMark(id: string) {
  try {
    const { error } = await supabase
      .from('PaperMark')
      .delete()
      .eq('id', id);
    
    if (error) throw error;

    revalidatePath("/admin/paper-marks");
    return { success: true };
  } catch (error) {
    console.error("Delete Mark Error:", error);
    return { error: "Failed to delete paper mark." };
  }
}
