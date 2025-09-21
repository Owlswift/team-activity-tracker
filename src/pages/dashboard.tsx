import { useState } from "react";
import { LoaderIcon, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/navbar";
import { useUser } from "@/lib/hooks/useUser";
import { useNotes } from "@/lib/hooks/useNotes";

export default function Dashboard() {
  const [newNote, setNewNote] = useState("");
  const { user, loading: userLoading } = useUser();
  const {
    notes,
    loading: notesLoading,
    adding,
    isRealTimeUpdating,
    addNote,
    deleting,
    deleteNote,
  } = useNotes(user);

  const isLoading = userLoading || notesLoading;

  const handleAddNote = async () => {
    if (!user) return;
    try {
      await addNote(newNote, user);
      setNewNote("");
    } catch (error) {}
  };

  const handleDeleteNote = async (id: string) => {
    if (!user) return;
    try {
      await deleteNote(id, user);
    } catch (error) {}
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 max-w-2xl mx-auto flex items-center justify-center">
        <LoaderIcon className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-2xl mx-auto">
      <Navbar title="Dashboard" />

      {isRealTimeUpdating && (
        <div className="fixed top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">
          Updating...
        </div>
      )}

      <div className="flex items-center gap-2 mb-6 bg-gray-50 p-4 rounded-xl shadow-sm">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write a note..."
          className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-500 text-gray-800"
          disabled={adding}
        />
        <button
          onClick={handleAddNote}
          disabled={adding || !newNote.trim()}
          className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? (
            <LoaderIcon className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="flex justify-between items-center bg-white border rounded-xl shadow-sm p-3"
            >
              <div className="flex-1">
                <p className="text-gray-700 break-words">{note.content}</p>
                <span className="text-gray-400 text-xs">
                  {new Date(note.created_at).toLocaleString()}
                </span>
              </div>
              {note.user_id === user?.id &&
                (deleting ? (
                  <LoaderIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
