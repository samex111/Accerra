import { API_URL } from "@/config/env";
import { create } from "zustand";

interface notesStore {
  notes: string[];
  notesData: any[];
  fetchNotes: () => Promise<void>;
  // fetchBookmarkQuestion: () => Promise<void>;
  addNotes: (id: string) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  updateNotes : (id : string , title? : string | undefined, body? : string | undefined) => Promise<void>;
}

export const useNotesStore = create<notesStore>((set, get) => ({
  notes: [],
  notesData: [],

  fetchNotes: async () => {
    try {
      const id = localStorage.getItem("StudentID");
      console.log("in the use notes hook",id)
      const res = await fetch(`${API_URL}/api/v1/user/notes`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      set({ notes: data.map((b: any) => b) }) 
    } catch (e) {
      console.error("Fetch notes error:", e);
    }
  },

  // fetchBookmarkQuestion: async () => {
  //   try {
  //     const notes = get().notes;
  //     if (!notes.length) return;
  //     const promises = notes.map((qid: string) =>
  //       fetch(`${API_URL}/api/v1/user/note/${qid}`, {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //       }).then((res) => res.json())
  //     );
  //     const results = await Promise.all(promises);
  //     const questions = results.map((r: any) => r.response);
  //     set({ notesData: questions });
  //   } catch (e) {
  //     console.error("Fetch notes questions error:", e);
  //   }
  // },

  addNotes: async (title? : string , body? : string ) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/user/add/notes`, {
        method: "POST",
         headers:{"Content-Type":"application/json"},
        credentials: "include",
         body: JSON.stringify({  title: title , body: body })
      });
      if (res.ok) set({ notes: [...get().notes] });
    } catch (e) {
      console.error("Add notes failed", e);
    }
  },

  removeBookmark: async (notesId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/user/delete/notes/${notesId}`, {
        method: "DELETE",
        credentials: "include",
         headers: { "Content-Type": "application/json" },
      });
      if (res.ok)
        set({
          notes: get().notes.filter((id: string) => id !== notesId),
        });
        await get().fetchNotes()
    } catch (e) {
      console.error("Remove notes failed", e);
    }
  },
  updateNotes : async (notesId:string , title : string | undefined ,body:string | undefined ) =>  {
   try {
     const res = await fetch(`${API_URL}/api/v1/user/update/note/${notesId}`, {
      method : "PUT",
      credentials : "include",
      headers : {"Content-Type" : 'application/json'},
      body : JSON.stringify({title : title , body : body})
     });
     if(res.ok){
      const data = await res.json()
     }
   } catch(e){

   }
  }

}));
