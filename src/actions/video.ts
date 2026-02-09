"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getAdminVideos() {
  try {
    const { data, error } = await supabase
      .from('VideoItem')
      .select('*, lessonPacks:_LessonPackVideos(count)')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(v => ({
        ...v,
        _count: {
            lessonPacks: v.lessonPacks?.[0]?.count || 0
        }
    }));
  } catch (error) {
    console.error("Get Videos Error:", error);
    return [];
  }
}

export async function createAdminVideo(data: any) {
  try {
    const { error } = await supabase
      .from('VideoItem')
      .insert({
        videoItemID: data.videoItemID,
        name: data.name,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        shortDescription: data.shortDescription,
        duration: data.duration,
      });

    if (error) {
      if (error.code === '23505') return { error: "Video ID must be unique." };
      throw error;
    }

    revalidatePath("/admin/videos");
    return { success: true };
  } catch (error: any) {
    console.error("Create Video Error:", error);
    return { error: "Failed to create video." };
  }
}

export async function deleteAdminVideo(id: string) {
  try {
    const { error } = await supabase
      .from('VideoItem')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath("/admin/videos");
    return { success: true };
  } catch (error) {
    console.error("Delete Video Error:", error);
    return { error: "Failed to delete video. It might be connected to lessons." };
  }
}

export async function updateAdminVideo(id: string, data: any) {
  try {
    const { error } = await supabase
      .from('VideoItem')
      .update({
        videoItemID: data.videoItemID,
        name: data.name,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        shortDescription: data.shortDescription,
        duration: data.duration,
      })
      .eq('id', id);

    if (error) {
      if (error.code === '23505') return { error: "Video ID must be unique." };
      throw error;
    }

    revalidatePath("/admin/videos");
    return { success: true };
  } catch (error: any) {
    console.error("Update Video Error:", error);
    return { error: "Failed to update video." };
  }
}
