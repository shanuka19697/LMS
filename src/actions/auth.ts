"use server";

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Register Student Action
export async function registerStudent(data: any) {
  try {
    // Generate Index Number
    const indexNumber = await generateIndexNumber(data.nic, data.examYear);
    
    // Check if student with generated index already exists
    const { data: existing, error: checkError } = await supabase
      .from('Student')
      .select('id')
      .eq('indexNumber', indexNumber)
      .single();

    if (existing) {
      return { error: "System error: Generated index already exists. Please try again." };
    }

    const { data: student, error: insertError } = await supabase
      .from('Student')
      .insert({
        indexNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password, 
        examYear: data.examYear,
        phoneNumber: data.phoneNumber,
        nic: data.nic,
        whatsappNumber: data.whatsappNumber || data.phoneNumber,
        institute: data.institute,
        stream: data.stream,
        district: data.district,
        school: data.school,
        address: data.address,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Set session cookie
    (await cookies()).set("student_index", student.indexNumber, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    console.log("Registered:", student.indexNumber);
    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong during registration." };
  }
}

async function generateIndexNumber(nic: string, examYear: string): Promise<string> {
    let birthYearXY = "";
    const cleanNic = nic.trim();
    if (cleanNic.length === 10) {
        birthYearXY = cleanNic.substring(0, 2);
    } else if (cleanNic.length === 12) {
        birthYearXY = cleanNic.substring(2, 4);
    } else {
        birthYearXY = "00"; 
    }

    const examYearEE = examYear.trim().slice(-2);
    const prefix = `${birthYearXY}${examYearEE}`;

    const { data: lastStudent, error } = await supabase
        .from('Student')
        .select('indexNumber')
        .like('indexNumber', `${prefix}%`)
        .order('indexNumber', { ascending: false })
        .limit(1)
        .single();

    let sequence = 1;
    if (lastStudent) {
        const lastSequenceStr = lastStudent.indexNumber.slice(-4);
        const lastSequence = parseInt(lastSequenceStr, 10);
        if (!isNaN(lastSequence)) {
            sequence = lastSequence + 1;
        }
    }

    const sequenceStr = sequence.toString().padStart(4, '0');
    return `${prefix}${sequenceStr}`;
}

export async function loginStudent(indexNumber: string, password: string) {
  try {
    const cleanIndex = indexNumber.trim().toLowerCase();
    const cleanPassword = password.trim();

    console.log(`Login Attempt for: [${cleanIndex}]`);
    
    // Diagnostic
    const { count, error: countError } = await supabase
      .from('Student')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Diagnostic: Found ${count} students in DB.`);

    const { data: student, error: loginError } = await supabase
      .from('Student')
      .select('*')
      .eq('indexNumber', cleanIndex)
      .single();

    if (loginError || !student) {
        console.log(`Login Failed: Student [${cleanIndex}] not found in DB.`);
        return { error: "Invalid index number or password." };
    }

    if (student.password !== cleanPassword) {
        console.log(`Login Failed: Password mismatch for ${cleanIndex}.`);
        return { error: "Invalid index number or password." };
    }

    console.log(`Login Success: ${cleanIndex}`);

    // Set session cookie
    (await cookies()).set("student_index", student.indexNumber, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, indexNumber: student.indexNumber };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Database error occurred during login." };
  }
}

// Logout Action
export async function logoutStudent() {
    (await cookies()).delete("student_index");
    redirect("/login");
}

// Check if authenticated
export async function getSession() {
    const cookieStore = await cookies();
    return cookieStore.get("student_index")?.value;
}
