import { API_URL } from "@/config/env";
import { create } from "zustand";

interface BookmarkStore {
  bookmarks: string[];
  bookmarkQuestions: any[];
  fetchBookmarks: () => Promise<void>;
  fetchBookmarkQuestion: () => Promise<void>;
  addBookmark: (id: string) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarks: [],
  bookmarkQuestions: [],

  fetchBookmarks: async () => {
    try {
      const id = localStorage.getItem("StudentID");
      console.log("in the use bookmark hook",id)
      const res = await fetch(`${API_URL}/api/v1/user/questions/bookmarked/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      set({ bookmarks: data.map((b: any) => b._id) });
    } catch (e) {
      console.error("Fetch bookmarks error:", e);
    }
  },

  fetchBookmarkQuestion: async () => {
    try {
      const bookmarks = get().bookmarks;
      if (!bookmarks.length) return;
      const promises = bookmarks.map((qid: string) =>
        fetch(`http://localhost:3000/api/v1/user/question/${qid}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      const questions = results.map((r: any) => r.response);
      set({ bookmarkQuestions: questions });
    } catch (e) {
      console.error("Fetch bookmark questions error:", e);
    }
  },

  addBookmark: async (questionId: string) => {
      const id = localStorage.getItem("StudentID");
    try {
      const res = await fetch(`http://localhost:3000/api/v1/user/add/bookmark/question/${questionId}`, {
        method: "POST",
         headers:{"Content-Type":"application/json"},
        credentials: "include",
         body: JSON.stringify({ questionId, student: id })
      });
      if (res.ok) set({ bookmarks: [...get().bookmarks, questionId] });
    } catch (e) {
      console.error("Add bookmark failed", e);
    }
  },

  removeBookmark: async (questionId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/user/delete/bookmark/${questionId}`, {
        method: "DELETE",
        credentials: "include",
         headers: { "Content-Type": "application/json" },
      });
      if (res.ok)
        set({
          bookmarks: get().bookmarks.filter((id: string) => id !== questionId),
        });
        await get().fetchBookmarkQuestion()
    } catch (e) {
      console.error("Remove bookmark failed", e);
    }
  },
}));
