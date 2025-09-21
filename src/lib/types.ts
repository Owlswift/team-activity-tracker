export interface Profile {
  id: string;
  email: string;
  role: string;
}

export interface Note {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface UseNotesReturn {
  notes: Note[];
  loading: boolean;
  adding: boolean;
  deleting: boolean;
  isRealTimeUpdating: boolean;
  addNote: (content: string, profile: Profile) => Promise<void>;
  deleteNote: (id: string, profile: Profile) => Promise<void>;
}

export interface AnalyticsData {
  userNotes: number;
  teamNotes: number;
}

export type NavbarProps = {
  title: "Dashboard" | "Analytics";
};
