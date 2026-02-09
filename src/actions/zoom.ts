"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Helper to extract Zoom details
function parseZoomLink(url: string) {
    let meetingId = "";
    let meetingPassword = "";

    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const jIndex = pathParts.indexOf('j');
        if (jIndex !== -1 && pathParts[jIndex + 1]) {
            meetingId = pathParts[jIndex + 1];
        }
        meetingPassword = urlObj.searchParams.get('pwd') || "";
        return { meetingId, meetingPassword };
    } catch (e) {
        console.error("Error parsing Zoom link:", e);
        return { meetingId, meetingPassword };
    }
}

export async function getAdminZoomMeetings() {
  try {
    const { data, error } = await supabase
      .from('ZoomMeetingItem')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get Zoom Meetings Error:", error);
    return [];
  }
}

export async function createAdminZoomMeeting(data: any) {
  try {
    const { meetingId, meetingPassword } = parseZoomLink(data.zoomLink);

    const { error } = await supabase
      .from('ZoomMeetingItem')
      .insert({
        zoomMeetingItemID: data.zoomMeetingItemID,
        name: data.name,
        shortDescription: data.shortDescription,
        zoomLink: data.zoomLink,
        meetingId: meetingId || null,
        meetingPassword: meetingPassword || null,
        startTime: new Date(data.startTime).toISOString(),
        examYear: data.examYear || "2025",
        isActive: data.isActive === 'true' || data.isActive === true
      });

    if (error) {
      if (error.code === '23505') return { error: "Zoom ID must be unique." };
      throw error;
    }

    revalidatePath("/admin/zoom");
    return { success: true };
  } catch (error: any) {
    console.error("Create Zoom Error:", error);
    return { error: "Failed to create meeting." };
  }
}

export async function updateAdminZoomMeeting(id: string, data: any) {
  try {
    const { meetingId, meetingPassword } = parseZoomLink(data.zoomLink);

    const { error } = await supabase
      .from('ZoomMeetingItem')
      .update({
        zoomMeetingItemID: data.zoomMeetingItemID,
        name: data.name,
        shortDescription: data.shortDescription,
        zoomLink: data.zoomLink,
        meetingId: meetingId || null,
        meetingPassword: meetingPassword || null,
        startTime: new Date(data.startTime).toISOString(),
        examYear: data.examYear || "2025",
        isActive: data.isActive === 'true' || data.isActive === true
      })
      .eq('id', id);

    if (error) {
      if (error.code === '23505') return { error: "Zoom ID must be unique." };
      throw error;
    }

    revalidatePath("/admin/zoom");
    return { success: true };
  } catch (error: any) {
    console.error("Update Zoom Error:", error);
    return { error: "Failed to update meeting." };
  }
}

export async function deleteAdminZoomMeeting(id: string) {
  try {
    const { error } = await supabase
      .from('ZoomMeetingItem')
      .delete()
      .eq('id', id);
    if (error) throw error;
    revalidatePath("/admin/zoom");
    return { success: true };
  } catch (error) {
    console.error("Delete Zoom Error:", error);
    return { error: "Failed to delete meeting." };
  }
}

export async function toggleZoomMeetingStatus(id: string, isActive: boolean) {
    try {
        const { error } = await supabase
            .from('ZoomMeetingItem')
            .update({ isActive })
            .eq('id', id);
        if (error) throw error;
        revalidatePath("/admin/zoom");
        return { success: true };
    } catch (error) {
        console.error("Toggle Status Error:", error);
        return { error: "Failed to update status." };
    }
}

export async function getActiveZoomMeetings(examYear?: string) {
    try {
        let query = supabase
            .from('ZoomMeetingItem')
            .select('*')
            .eq('isActive', true);
        
        if (examYear) {
            query = query.eq('examYear', examYear);
        }

        const { data, error } = await query.order('startTime', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Get Active Zoom Error:", error);
        return [];
    }
}
