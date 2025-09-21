import { supabase } from "@/lib/superbaseClient";
import { Profile } from "@/lib/types";

export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    console.error("Error getting user:", authError);
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", auth.user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile;
};

export const signUpUser = async (
  email: string,
  password: string,
  role: string
): Promise<void> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });

  if (error) {
    console.error("Error signing up:", error);
    throw error;
  }

  const userId = data.user?.id;
  if (!userId) {
    throw new Error("User not created. Please confirm your email.");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert([{ id: userId, email, role }]);

  if (profileError) {
    console.error("Error creating profile:", profileError);
    throw new Error("Failed to create user profile");
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<Profile> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in:", error);
    throw error;
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    await supabase.auth.signOut();
    throw new Error("Your account is missing a profile. Contact admin.");
  }

  return profile;
};
