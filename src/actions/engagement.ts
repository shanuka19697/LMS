"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Normalizes a date to UTC midnight (00:00:00.000Z)
 */
function normalizeToUTC(dateInput: string | Date) {
    const date = new Date(dateInput);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime();
}

/**
 * Updates a student's study streak based on daily activity log.
 */
export async function updateStudentStreak(studentIndex: string) {
  try {
    const todayUTC = normalizeToUTC(new Date());

    const { data: student, error: fetchError } = await supabase
      .from('Student')
      .select('lastActive, currentStreak, highestStreak')
      .eq('indexNumber', studentIndex)
      .single();

    if (fetchError || !student) return null;

    const lastActiveUTC = normalizeToUTC(student.lastActive || new Date());

    const diffInDays = Math.floor((todayUTC - lastActiveUTC) / (1000 * 60 * 60 * 24));

    let newStreak = student.currentStreak;

    if (diffInDays === 1) {
      newStreak += 1;
    } else if (diffInDays > 1) {
      newStreak = 1;
    } else if (diffInDays === 0) {
      return { success: true, streak: newStreak };
    }

    const highestStreak = Math.max(newStreak, student.highestStreak);

    const { error: updateError } = await supabase
      .from('Student')
      .update({
        currentStreak: newStreak,
        highestStreak: highestStreak,
        lastActive: new Date().toISOString()
      })
      .eq('indexNumber', studentIndex);

    if (updateError) throw updateError;

    // Handle Badge Achievements
    await checkAndAwardBadges(studentIndex, newStreak);

    revalidatePath("/dashboard");
    return { success: true, streak: newStreak };
  } catch (error) {
    console.error("Streak Update Error:", error);
    return null;
  }
}

/**
 * Checks if a student qualifies for any new badges and awards them.
 */
async function checkAndAwardBadges(studentIndex: string, streak: number) {
    const badgesToAward = [];
    
    if (streak >= 7) badgesToAward.push("ONE_WEEK_STREAK");
    if (streak >= 30) badgesToAward.push("ONE_MONTH_STREAK");
    
    const badgeMetadata: any = {
        "ONE_WEEK_STREAK": { name: "7 Day Streak", description: "Studied for 7 days in a row!", type: "STREAK" },
        "ONE_MONTH_STREAK": { name: "30 Day Streak", description: "A whole month of dedicated study!", type: "STREAK" }
    };

    // Get student ID (needed for join table)
    const { data: studentData } = await supabase.from('Student').select('id').eq('indexNumber', studentIndex).single();
    if (!studentData) return;

    for (const type of badgesToAward) {
        const metadata = badgeMetadata[type];
        
        // Find or create badge
        let { data: badge, error: badgeError } = await supabase
            .from('Badge')
            .select('id, name')
            .eq('name', metadata.name)
            .single();

        if (!badge) {
            const { data: newBadge, error: createError } = await supabase
                .from('Badge')
                .insert(metadata)
                .select()
                .single();
            if (createError) continue;
            badge = newBadge;
        }

        if (!badge) continue;

        // Award to student if they don't have it
        const { data: hasBadge } = await supabase
            .from('_StudentBadges')
            .select('*')
            .eq('A', studentData.id)
            .eq('B', badge.id)
            .single();

        if (!hasBadge && badge) {
            await supabase.from('_StudentBadges').insert({ A: studentData.id, B: badge.id });

            // Send notification
            await supabase.from('Notification').insert({
                studentIndex,
                message: `Congratulations! You've earned the "${badge.name}" badge!`,
                type: "INFO"
            });
        }
    }
}

/**
 * Checks for significant drops in paper marks and sends a warning.
 */
export async function checkMarkVolatility(studentIndex: string, currentMarkTotal: number) {
    try {
        const { data: previousMarks, error } = await supabase
            .from('PaperMark')
            .select('totalMark')
            .eq('studentIndex', studentIndex)
            .order('createdAt', { ascending: false })
            .limit(6);

        if (error || !previousMarks || previousMarks.length < 3) return;

        const history = previousMarks.slice(1);
        const avg = history.reduce((sum, m) => sum + m.totalMark, 0) / history.length;

        if (currentMarkTotal < avg * 0.75) {
            await supabase.from('Notification').insert({
                studentIndex,
                message: `⚠️ Attention: Your latest mark of ${currentMarkTotal}% is significantly lower than your previous average of ${avg.toFixed(1)}%. Keep working hard and ask for help if needed!`,
                type: "WARNING"
            });
        }
    } catch (error) {
        console.error("Volatility Check Error:", error);
    }
}

/**
 * Checks for student inactivity (> 7 days) and sends a reminder.
 */
export async function checkInactivityReminders() {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: inactiveStudents, error } = await supabase
            .from('Student')
            .select('indexNumber')
            .lt('lastActive', sevenDaysAgo.toISOString());

        if (error || !inactiveStudents) return;

        for (const student of inactiveStudents) {
            const { data: recentReminder } = await supabase
                .from('Notification')
                .select('id')
                .eq('studentIndex', student.indexNumber)
                .ilike('message', '%noticed you haven\'t logged any activity%')
                .gt('createdAt', sevenDaysAgo.toISOString())
                .limit(1);

            if (!recentReminder || recentReminder.length === 0) {
                await supabase.from('Notification').insert({
                    studentIndex: student.indexNumber,
                    message: "We noticed you haven't logged any activity for over a week. Keep up the momentum! Consistency is key to success. 🚀",
                    type: "INFO"
                });
            }
        }
    } catch (error) {
        console.error("Inactivity Check Error:", error);
    }
}
