"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { checkInactivityReminders, checkMarkVolatility, updateStudentStreak } from "./engagement";

/**
 * Normalizes a date to UTC midnight (00:00:00.000Z)
 */
function normalizeToUTC(dateInput: string | Date) {
    const date = new Date(dateInput);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString();
}

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getUTCDay();
  const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), diff));
}

// Admin: Get All Students
export async function getAdminStudents() {
  try {
    const { data: students, error } = await supabase
      .from('Student')
      .select('*, purchases:LessonPurchase(count)')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    
    // Transform to match Prisma's return structure if needed
    return students.map(s => ({
        ...s,
        _count: {
            purchases: s.purchases?.[0]?.count || 0
        }
    }));
  } catch (error) {
    console.error("Get Students Error:", error);
    return [];
  }
}

// Admin: Create Student
export async function createAdminStudent(data: any) {
    try {
        const { error } = await supabase
            .from('Student')
            .insert({
                firstName: data.firstName,
                lastName: data.lastName,
                indexNumber: data.indexNumber,
                email: data.email,
                phoneNumber: data.phoneNumber || "",
                nic: data.nic || "",
                whatsappNumber: data.whatsappNumber || "",
                institute: data.institute || "",
                stream: data.stream || "",
                district: data.district || "",
                school: data.school || "",
                address: data.address || "",
                examYear: data.examYear || "2025",
                password: data.password || "student123",
            });

        if (error) {
            if (error.code === '23505') { // Postgres duplicate key error
                return { error: "Index number or Email already exists." };
            }
            throw error;
        }

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        console.error("Create Student Error:", error);
        return { error: "Failed to create student." };
    }
}

// Admin: Delete Student
export async function deleteAdminStudent(indexNumber: string) {
    try {
        const { error } = await supabase
            .from('Student')
            .delete()
            .eq('indexNumber', indexNumber);

        if (error) throw error;

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        console.error("Delete Student Error:", error);
        return { error: "Failed to delete student." };
    }
}

// Admin: Update Student
export async function updateAdminStudent(indexNumber: string, data: any) {
    try {
        const { error } = await supabase
            .from('Student')
            .update({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber || "",
                nic: data.nic || "",
                whatsappNumber: data.whatsappNumber || "",
                institute: data.institute || "",
                stream: data.stream || "",
                district: data.district || "",
                school: data.school || "",
                address: data.address || "",
                examYear: data.examYear || "2025",
            })
            .eq('indexNumber', indexNumber);

        if (error) {
            if (error.code === '23505') {
                return { error: "Email already exists." };
            }
            throw error;
        }

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        console.error("Update Student Error:", error);
        return { error: "Failed to update student." };
    }
}

// Fetch Student Profile by Index Number
export async function getStudentProfile(indexNumber: string) {
  try {
    const { data: student, error } = await supabase
      .from('Student')
      .select(`
        *,
        badges:Badge (
          *
        )
      `)
      .eq('indexNumber', indexNumber)
      .maybeSingle();

    if (error || !student) {
      console.log("Student not found or error:", error);
      return null;
    }

    // Proactively check for inactivity reminders
    checkInactivityReminders().catch(console.error);

    return student;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}

// Fetch Daily Work Activity for Graph
export async function getDailyWorkActivity(indexNumber: string) {
  try {
    const { data: activity, error } = await supabase
        .from('DailyWorkTime')
        .select('*')
        .eq('studentIndex', indexNumber)
        .order('weekStartDate', { ascending: false })
        .limit(1)
        .maybeSingle();

    const defaultActivity = [
        { day: "Mon", hours: 0 },
        { day: "Tue", hours: 0 },
        { day: "Wed", hours: 0 },
        { day: "Thu", hours: 0 },
        { day: "Fri", hours: 0 },
        { day: "Sat", hours: 0 },
        { day: "Sun", hours: 0 },
    ];

    if (error || !activity) {
        return defaultActivity;
    }

    // Transform DB data to Graph format
    return [
        { day: "Mon", hours: activity.monday || 0 },
        { day: "Tue", hours: activity.tuesday || 0 },
        { day: "Wed", hours: activity.wednesday || 0 },
        { day: "Thu", hours: activity.thursday || 0 },
        { day: "Fri", hours: activity.friday || 0 },
        { day: "Sat", hours: activity.saturday || 0 },
        { day: "Sun", hours: activity.sunday || 0 },
    ];

  } catch (error) {
    console.error("Database Error:", error);
    return [
        { day: "Mon", hours: 0 },
        { day: "Tue", hours: 0 },
        { day: "Wed", hours: 0 },
        { day: "Thu", hours: 0 },
        { day: "Fri", hours: 0 },
        { day: "Sat", hours: 0 },
        { day: "Sun", hours: 0 },
    ];
  }
}

// Update Student Profile
export async function updateStudentProfile(indexNumber: string, data: any) {
  try {
    const { data: updated, error } = await supabase
      .from('Student')
      .upsert({
        indexNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        nic: data.nic,
        whatsappNumber: data.whatsappNumber,
        institute: data.institute,
        stream: data.stream,
        examYear: data.examYear,
        district: data.district,
        school: data.school,
        address: data.address,
        password: data.password || "default_password_change_me", // Required if creating
      }, { onConflict: 'indexNumber' })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/profile");
    return { success: true, student: updated };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Failed to update profile." };
  }
}

// Change Student Password
export async function changeStudentPassword(indexNumber: string, oldPassword: string, newPassword: string) {
  try {
    const { data: student, error: fetchError } = await supabase
      .from('Student')
      .select('password')
      .eq('indexNumber', indexNumber)
      .single();

    if (fetchError || !student || student.password !== oldPassword) {
      return { error: "Incorrect current password." };
    }

    const { error: updateError } = await supabase
      .from('Student')
      .update({ password: newPassword })
      .eq('indexNumber', indexNumber);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error("Password Change Error:", error);
    return { error: "Failed to change password." };
  }
}

// Log Daily Work Time
export async function logDailyWorkTime(indexNumber: string, hours: number) {
  try {
    const mondayISO = normalizeToUTC(getMonday(new Date()));

    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()).toLowerCase();

    // Check if student exists
    const { data: studentExists, error: checkError } = await supabase
      .from('Student')
      .select('id')
      .eq('indexNumber', indexNumber)
      .single();

    if (checkError || !studentExists) {
      console.warn(`Attempted to log time for non-existent student: ${indexNumber}`);
      return { error: "Student profile not found." };
    }

    const { data: record, error: findError } = await supabase
      .from('DailyWorkTime')
      .select('id')
      .eq('studentIndex', indexNumber)
      .eq('weekStartDate', mondayISO)
      .single();

    if (record) {
      const { error: updateError } = await supabase
        .from('DailyWorkTime')
        .update({ [dayName]: hours })
        .eq('id', record.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('DailyWorkTime')
        .insert({
          studentIndex: indexNumber,
          weekStartDate: mondayISO,
          [dayName]: hours
        });
      if (insertError) throw insertError;
    }

    await updateStudentStreak(indexNumber);
    return { success: true };
  } catch (error) {
    console.error("Logging Error:", error);
    return { error: "Failed to log work hours." };
  }
}

// Check if Logged Today
export async function hasLoggedToday(indexNumber: string) {
    try {
        const mondayISO = normalizeToUTC(getMonday(new Date()));

        const { data: record, error } = await supabase
            .from('DailyWorkTime')
            .select('*')
            .eq('studentIndex', indexNumber)
            .eq('weekStartDate', mondayISO)
            .single();

        if (error || !record) return false;

        const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()).toLowerCase();
        return record[dayName] > 0;
    } catch (e) {
        return false;
    }
}

// Fetch Paper Marks for a student
export async function getPaperMarks(indexNumber: string) {
  try {
    const { data: marks, error } = await supabase
      .from('PaperMark')
      .select('*, paper:Paper(*)')
      .eq('studentIndex', indexNumber)
      .eq('paper.isActive', true) // Note: This might need a separate filter or join logic in Supabase
      .order('createdAt', { ascending: false });

    // Supabase filtering on joined tables can be tricky. 
    // Alternative:
    const { data: filteredMarks, error: marksError } = await supabase
      .from('PaperMark')
      .select(`
        *,
        paper:Paper!inner (
          *
        )
      `)
      .eq('studentIndex', indexNumber)
      .eq('paper.isActive', true)
      .order('createdAt', { ascending: false });

    if (error || marksError) throw (error || marksError);

    return (filteredMarks || []).map(m => ({
        ...m,
        paperName: m.paper ? m.paper.title : "Unknown Paper"
    }));
  } catch (error) {
    console.error("Fetch Paper Marks Error:", error);
    return [];
  }
}

// Submit a new Paper Mark
export async function submitPaperMark(indexNumber: string, data: any) {
  try {
    const firstMark = parseFloat(data.firstMark || 0);
    const secondMark = data.type === 'TIMING' ? 0 : parseFloat(data.secondMark || 0);
    const totalMark = firstMark + secondMark;
    
    const { data: mark, error } = await supabase
      .from('PaperMark')
      .insert({
        studentIndex: indexNumber,
        type: data.type,
        paperId: data.paperId,
        firstMark: firstMark,
        secondMark: data.type === 'TIMING' ? null : secondMark,
        totalMark: totalMark,
      })
      .select()
      .single();

    if (error) throw error;

    await checkMarkVolatility(indexNumber, totalMark);
    return { success: true, mark };
  } catch (error) {
    console.error("Submit Paper Mark Error:", error);
    return { error: "Failed to submit paper marks." };
  }
}

// Search Students (for Combobox)
export async function searchStudents(query: string) {
    try {
        const { data, error } = await supabase
            .from('Student')
            .select('indexNumber, firstName, lastName')
            .or(`indexNumber.ilike.%${query}%,firstName.ilike.%${query}%,lastName.ilike.%${query}%`)
            .limit(10);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Search Students Error:", error);
        return [];
    }
}
