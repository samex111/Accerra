import { API_URL } from "@/config/env";
import { create } from "zustand";

interface notesStore {
  notes: string[];
  notesData: any[];
  fetchBookmarks: () => Promise<void>;
  fetchBookmarkQuestion: () => Promise<void>;
  addBookmark: (id: string) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
}

export const useNotesStore = create<notesStore>((set, get) => ({
  notes: [],
  notesData: [],

  fetchBookmarks: async () => {
    try {
      const id = localStorage.getItem("StudentID");
      console.log("in the use notes hook",id)
      const res = await fetch(`${API_URL}/api/v1/user/notes/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      set({ notes: data.map((b: any) => b._id) }) 
    } catch (e) {
      console.error("Fetch notes error:", e);
    }
  },

  fetchBookmarkQuestion: async () => {
    try {
      const notes = get().notes;
      if (!notes.length) return;
      const promises = notes.map((qid: string) =>
        fetch(`${API_URL}/api/v1/user/note/${qid}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      const questions = results.map((r: any) => r.response);
      set({ notesData: questions });
    } catch (e) {
      console.error("Fetch notes questions error:", e);
    }
  },

  addBookmark: async (questionId: string) => {
      const id = localStorage.getItem("StudentID");
    try {
      const res = await fetch(`http://localhost:3000/api/v1/user/add/notes/${questionId}`, {
        method: "POST",
         headers:{"Content-Type":"application/json"},
        credentials: "include",
         body: JSON.stringify({ questionId, student: id })
      });
      if (res.ok) set({ notes: [...get().notes, questionId] });
    } catch (e) {
      console.error("Add notes failed", e);
    }
  },

  removeBookmark: async (questionId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/user/delete/notes/${questionId}`, {
        method: "DELETE",
        credentials: "include",
         headers: { "Content-Type": "application/json" },
      });
      if (res.ok)
        set({
          notes: get().notes.filter((id: string) => id !== questionId),
        });
        await get().fetchBookmarkQuestion()
    } catch (e) {
      console.error("Remove notes failed", e);
    }
  },
}));
