import { supabase } from "@/lib/superbaseClient";
import { Note, Profile } from "@/lib/types";

export const fetchNotes = async (profile: Profile): Promise<Note[]> => {
  let query = supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (profile.role !== "admin") {
    query = query.eq("user_id", profile.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes");
  }

  return data || [];
};

export const fetchAllNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all notes:", error);
    throw new Error("Failed to fetch notes");
  }

  return data || [];
};

export const addNote = async (
  content: string,
  profile: Profile
): Promise<Note> => {
  const { data, error } = await supabase
    .from("notes")
    .insert([{ content, user_id: profile.id }])
    .select()
    .single();

  if (error) {
    console.error("Error adding note:", error);
    throw new Error("Failed to add note");
  }

  return data as Note;
};

export const deleteNote = async (
  noteId: string,
  profile: Profile
): Promise<void> => {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", profile.id);

  if (error) {
    console.error("Error deleting note:", error);
    throw new Error("Failed to delete note");
  }
};
