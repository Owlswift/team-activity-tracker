import { useState, useEffect, useCallback } from "react";
import { Note, Profile, UseNotesReturn } from "@/lib/types";
import * as noteService from "@/services/noteServices";
import { supabase } from "@/lib/superbaseClient";

export const useNotes = (profile: Profile | null): UseNotesReturn => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isRealTimeUpdating, setIsRealTimeUpdating] = useState(false);

  useEffect(() => {
    if (!profile) {
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const fetchedNotes =
          profile.role === "admin"
            ? await noteService.fetchAllNotes()
            : await noteService.fetchNotes(profile);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    // Set up realtime subscription
    const channel = supabase
      .channel("notes-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notes",
        },
        (payload) => {
          setIsRealTimeUpdating(true);
          const newNote = payload.new as Note;
          setNotes((prev) => [newNote, ...prev]);
          setTimeout(() => setIsRealTimeUpdating(false), 1000);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notes",
        },
        (payload) => {
          setIsRealTimeUpdating(true);
          setNotes((prev) => prev.filter((note) => note.id !== payload.old.id));
          setTimeout(() => setIsRealTimeUpdating(false), 1000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const addNote = useCallback(async (content: string, profile: Profile) => {
    if (!content.trim()) return;

    setAdding(true);
    try {
      await noteService.addNote(content.trim(), profile);
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    } finally {
      setAdding(false);
    }
  }, []);

  const deleteNote = useCallback(async (id: string, profile: Profile) => {
    setDeleting(true);
    try {
      await noteService.deleteNote(id, profile);
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    notes,
    loading,
    adding,
    isRealTimeUpdating,
    addNote,
    deleting,
    deleteNote,
  };
};
