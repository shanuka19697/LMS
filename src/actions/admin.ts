"use server";

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface AdminLoginData {
  username: string;
  password: string;
}

export async function loginAdmin(data: AdminLoginData) {
  try {
    const { username, password } = data;

    if (!username || !password) {
      return { error: "Username and password are required." };
    }

    const { data: admin, error } = await supabase
      .from('Admin')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin || admin.password !== password) {
      return { error: "Invalid username or password." };
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", admin.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    });
    
    cookieStore.set("admin_role", admin.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error) {
    console.error("Admin Login Error:", error);
    return { error: "Something went wrong during login." };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.delete("admin_role");
  redirect("/admin/login");
}

export async function getAdminRole() {
  const cookieStore = await cookies();
  const username = cookieStore.get("admin_session")?.value;
  
  if (!username) return null;

  const { data: admin, error } = await supabase
    .from('Admin')
    .select('role')
    .eq('username', username)
    .single();

  if (error) return null;
  return admin?.role || null;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value;
}

export async function getAdmins() {
  try {
    const { data, error } = await supabase
      .from('Admin')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get Admins Error:", error);
    return [];
  }
}

export async function createAdmin(data: any) {
  try {
    const { username, email, password, role } = data;

    const { error } = await supabase
      .from('Admin')
      .insert({
        username,
        email,
        password,
        role: role || 'SUPER_ADMIN'
      });

    if (error) {
      if (error.code === '23505') return { error: "Username or Email already exists." };
      throw error;
    }

    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error: any) {
    console.error("Create Admin Error:", error);
    return { error: "Failed to create administrator." };
  }
}

export async function updateAdmin(id: string, data: any) {
  try {
    const { username, email, password, role } = data;
    
    const updateData: any = { username, email, role };
    if (password) updateData.password = password;

    const { error } = await supabase
      .from('Admin')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error) {
    console.error("Update Admin Error:", error);
    return { error: "Failed to update administrator." };
  }
}

export async function deleteAdmin(id: string) {
  try {
    const { error } = await supabase
      .from('Admin')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error) {
    console.error("Delete Admin Error:", error);
    return { error: "Failed to delete administrator." };
  }
}

export async function getAdminDashboardStats() {
  try {
    const { count: studentCount } = await supabase
      .from('Student')
      .select('*', { count: 'exact', head: true });

    const { count: lessonCount } = await supabase
      .from('LessonPack')
      .select('*', { count: 'exact', head: true });

    const { count: pendingPurchases } = await supabase
      .from('LessonPurchase')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING');

    const { data: approvedPurchases, error: revenueError } = await supabase
      .from('LessonPurchase')
      .select('totalPrice')
      .eq('status', 'APPROVED');

    if (revenueError) throw revenueError;

    const totalRevenue = approvedPurchases?.reduce((sum, p) => sum + (p.totalPrice || 0), 0) || 0;

    return {
      studentCount: studentCount || 0,
      lessonCount: lessonCount || 0,
      pendingPurchases: pendingPurchases || 0,
      totalRevenue
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return null;
  }
}
