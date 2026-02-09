"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { getSession } from "@/actions/auth";

export async function getAdminLessons() {
  try {
    const { data: lessons, error } = await supabase
      .from('LessonPack')
      .select('*, videos:VideoItem(*), purchases:LessonPurchase(count)')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    
    return (lessons || []).map(l => ({
        ...l,
        _count: {
            purchases: l.purchases?.[0]?.count || 0
        }
    }));
  } catch (error) {
    console.error("Get Lessons Error:", error);
    return [];
  }
}

export async function createAdminLesson(data: any, videoIds: string[]) {
  try {
    const { data: lesson, error: lessonError } = await supabase
      .from('LessonPack')
      .insert({
        lessonPackID: data.lessonPackID,
        name: data.name,
        examYear: data.examYear,
        type: data.type,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
      })
      .select()
      .single();

    if (lessonError) {
      if (lessonError.code === '23505') return { error: "Lesson Pack ID must be unique." };
      throw lessonError;
    }

    if (videoIds && videoIds.length > 0) {
        const joinData = videoIds.map(vid => ({ A: lesson.id, B: vid }));
        const { error: joinError } = await supabase
            .from('_LessonPackVideos')
            .insert(joinData);
        if (joinError) throw joinError;
    }

    revalidatePath("/admin/lessons");
    return { success: true };
  } catch (error: any) {
    console.error("Create Lesson Error:", error);
    return { error: "Failed to create lesson pack." };
  }
}

export async function deleteAdminLesson(id: string) {
  try {
    const { error } = await supabase
      .from('LessonPack')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath("/admin/lessons");
    return { success: true };
  } catch (error) {
    console.error("Delete Lesson Error:", error);
    return { error: "Failed to delete lesson pack." };
  }
}

export async function updateAdminLesson(id: string, data: any, videoIds: string[]) {
  try {
    const { error: updateError } = await supabase
      .from('LessonPack')
      .update({
        lessonPackID: data.lessonPackID,
        name: data.name,
        examYear: data.examYear,
        type: data.type,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
      })
      .eq('id', id);

    if (updateError) {
      if (updateError.code === '23505') return { error: "Lesson Pack ID must be unique." };
      throw updateError;
    }

    // Update videos (delete then insert for simplicity in many-to-many)
    await supabase.from('_LessonPackVideos').delete().eq('A', id);
    
    if (videoIds && videoIds.length > 0) {
        const joinData = videoIds.map(vid => ({ A: id, B: vid }));
        const { error: joinError } = await supabase
            .from('_LessonPackVideos')
            .insert(joinData);
        if (joinError) throw joinError;
    }

    revalidatePath("/admin/lessons");
    return { success: true };
  } catch (error: any) {
    console.error("Update Lesson Error:", error);
    return { error: "Failed to update lesson pack." };
  }
}

// Student Purchases
export async function getStudentPurchases() {
  try {
      const indexNumber = await getSession();
      if (!indexNumber) return [];
      
      const { data: purchases, error } = await supabase
          .from('LessonPurchase')
          .select('*, lesson:LessonPack(name, imageUrl, price, examYear)')
          .eq('studentIndex', indexNumber)
          .order('createdAt', { ascending: false });

      if (error) throw error;
      return purchases || [];
  } catch (error) {
      console.error("Get Student Purchases Error:", error);
      return [];
  }
}

// Purchase Lesson Pack
export async function purchaseLessonPack(data: { lessonId: string, tuteDelivery: boolean, totalPrice: number, slipUrl: string }) {
  try {
      const studentIndex = await getSession();
      if (!studentIndex) return { error: "You must be logged in to purchase." };
      
      const { data: lesson, error: lessonError } = await supabase
          .from('LessonPack')
          .select('id')
          .eq('id', data.lessonId)
          .single();

      if (lessonError || !lesson) return { error: "Lesson pack not found." };

      // Check if student already has a record for this lesson
      const { data: existingPurchase } = await supabase
          .from('LessonPurchase')
          .select('id, status')
          .eq('lessonId', data.lessonId)
          .eq('studentIndex', studentIndex)
          .maybeSingle();

      if (existingPurchase) {
          if (existingPurchase.status === "APPROVED" || existingPurchase.status === "PENDING") {
              return { error: "An enrollment request is already active for this lesson." };
          }

          // If REJECTED, we update the existing record
          const { error: updateError } = await supabase
              .from('LessonPurchase')
              .update({
                  totalPrice: data.totalPrice,
                  status: "PENDING",
                  tuteDelivery: data.tuteDelivery,
                  slipUrl: data.slipUrl,
                  createdAt: new Date().toISOString()
              })
              .eq('id', existingPurchase.id);
          
          if (updateError) throw updateError;
      } else {
          // No record exists, insert new
          const { error: insertError } = await supabase
              .from('LessonPurchase')
              .insert({
                  lessonId: data.lessonId,
                  studentIndex,
                  totalPrice: data.totalPrice,
                  status: "PENDING",
                  tuteDelivery: data.tuteDelivery,
                  slipUrl: data.slipUrl
              });
          
          if (insertError) throw insertError;
      }

      revalidatePath("/dashboard/store");
      revalidatePath(`/dashboard/store/${data.lessonId}`);
      revalidatePath("/dashboard/payment");
      return { success: true };
  } catch (error) {
      console.error("Purchase Error:", error);
      return { error: "Failed to purchase lesson pack." };
  }
}

// Get Lesson Pack by ID
export async function getLessonPackById(id: string) {
  try {
      const studentIndex = await getSession();
      
      // In Supabase many-to-many fetching is a bit different
      const { data: lesson, error } = await supabase
          .from('LessonPack')
          .select(`
            *,
            videos:VideoItem(*),
            purchases:LessonPurchase(*)
          `)
          .eq('id', id)
          .eq('purchases.studentIndex', studentIndex)
          .single();

      if (error) {
          // If no purchase found, the above might error depending on how inner joins work.
          // Better approach: fetch lesson and videos, then check purchase separately or use outer join
          const { data: basicLesson, error: basicError } = await supabase
            .from('LessonPack')
            .select('*, videos:VideoItem(*)')
            .eq('id', id)
            .single();
          
          if (basicError) throw basicError;

          const { data: studentPurchase } = await supabase
            .from('LessonPurchase')
            .select('*')
            .eq('lessonId', id)
            .eq('studentIndex', studentIndex);

          return {
            ...basicLesson,
            purchases: studentPurchase || []
          };
      }
      return lesson;
  } catch (error) {
      console.error("Get Lesson Error:", error);
      return null;
  }
}

// Get All Lesson Packs with student purchase status
export async function getLessonPacks(examYear?: string) {
  try {
      const studentIndex = await getSession();
      
      let query = supabase
          .from('LessonPack')
          .select(`
            *, 
            videos:VideoItem(*),
            purchases:LessonPurchase(*)
          `)
          .order('createdAt', { ascending: false });
      
      if (studentIndex) {
          query = query.eq('purchases.studentIndex', studentIndex);
      }
      
      if (examYear) {
          query = query.eq('examYear', examYear);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
  } catch (error) {
      console.error("Get Lessons Error:", error);
      return [];
  }
}

// Get Lesson with Videos
export async function getLessonWithVideos(id: string) {
  try {
      const { data: lesson, error } = await supabase
          .from('LessonPack')
          .select('*, videos:VideoItem(*)')
          .eq('id', id)
          .single();

      if (error) throw error;
      return lesson;
  } catch (error) {
      console.error("Get Lesson Error:", error);
      return null;
  }
}

// Get Enrolled Lessons
export async function getEnrolledLessons() {
  try {
      const indexNumber = await getSession();
      if (!indexNumber) return [];
      
      const { data: purchases, error } = await supabase
          .from('LessonPurchase')
          .select('*, lesson:LessonPack(*)')
          .eq('studentIndex', indexNumber)
          .eq('status', 'APPROVED')
          .order('createdAt', { ascending: false });

      if (error) throw error;
      return (purchases || []).map(p => p.lesson);
  } catch (error) {
      console.error("Get Enrolled Lessons Error:", error);
      return [];
  }
}
