import { API_URL } from "@/config/env";
import { addNotesProps, notesData } from "@/types/notesTypes";
import { create } from "zustand";

interface notesStore {
  notes: notesData["data"];
  fetchNotes: () => Promise<void>;
  addNotes: ({title , body} : addNotesProps) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  updateNote: (id : string ,  {title , body } : addNotesProps) => Promise<void>;
}

export const useNotesStore = create<notesStore>((set, get) => ({
  notes: [],
   
  fetchNotes: async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/user/notes`, {
        method: "GET",
        credentials: "include",
        headers: {"Content-Type" : "application/json"}
      });
      const data:notesData = await res.json();
      console.log(data.data.map((i:notesData['data'][0])=>i))
      set({ notes: data.data.map((i:notesData['data'][0])=>i) })
    } catch (e) {
      console.error("Fetch notes error:", e);
    }
  },

   

  addNotes: async ({title ,body } : addNotesProps ) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/user/add/notes`, {
        method: "POST",
         headers:{"Content-Type":"application/json"},
        credentials: "include",
         body: JSON.stringify({  title: title , body: body })
      });
      console.log("Note addded")
      if (res.ok) get().fetchNotes();
    } catch (e) {
      console.error("Add notes failed", e);
    }
  },

  removeNote: async (notesId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/user/note/delete/${notesId}`, {
        method: "DELETE",
        credentials: "include",
         headers: { "Content-Type": "application/json" }
      });
      if (res.ok)
         console.log("note removed ")
        await get().fetchNotes();
    } catch (e) {
      console.error("Remove notes failed", e);
    }
  },
  updateNote : async (notesId:string , {title, body } : addNotesProps ) =>  {
   try {
     const res = await fetch(`${API_URL}/api/v1/user/note/update/${notesId}`, {
      method : "PUT",
      credentials : "include",
      headers : {"Content-Type" : 'application/json'},
      body : JSON.stringify({title : title , body : body})
     });
     if(res.ok){
      console.log(" note updated ")
       get().fetchNotes();
     }
   } catch(e){
      console.error("Error in update notes " + e)
   }
  }

}));
