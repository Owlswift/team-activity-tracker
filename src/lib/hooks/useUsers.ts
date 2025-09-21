import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserProfile } from "@/services/userServices";
import { Profile } from "@/lib/types";

export const useUser = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (!profile) {
          router.push("/");
          return;
        }
        setUser(profile);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { user, loading };
};
