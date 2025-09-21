import { useState, useEffect } from "react";
import { supabase } from "@/lib/superbaseClient";
import { AnalyticsData } from "../types";

export const useAnalytics = (
  userId: string | null,
  userRole: string | null
) => {
  const [data, setData] = useState<AnalyticsData>({
    userNotes: 0,
    teamNotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !userRole) return;

    const fetchStats = async () => {
      try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        const isoDate = startOfWeek.toISOString();

        const { count: userCount } = await supabase
          .from("notes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .gte("created_at", isoDate);

        let teamCount = 0;

        if (userRole === "admin") {
          const { count } = await supabase
            .from("notes")
            .select("*", { count: "exact", head: true })
            .gte("created_at", isoDate);
          teamCount = count || 0;
        }

        setData({
          userNotes: userCount || 0,
          teamNotes: teamCount,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, userRole]);

  return { data, loading };
};
