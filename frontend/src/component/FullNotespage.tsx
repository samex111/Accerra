 import { useEffect, useState } from "react";
import { useNotesStore } from "@/hooks/useNotes";
import { Trash2, Pencil } from "lucide-react";

export default function Notes() {
  const { notes, fetchNotes, addNotes, removeNote, updateNote } =
    useNotesStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [editId, setEditId] = useState<string | null>(null);

  // 🔥 sidebar click pe component mount hoga → fetch
  useEffect(() => {
    fetchNotes();
  }, []);

  // ➕ Add Note
  const handleAdd = async () => {
    if (!body?.trim()) return;

    await addNotes({ title, body });

    setTitle("");
    setBody("");
  };

  // ✏️ Update Note
  const handleUpdate = async () => {
    if (!editId) return;

    await updateNote(editId, { title, body });

    setEditId(null);
    setTitle("");
    setBody("");
  };

  // 🧠 Edit mode trigger
  const handleEdit = (note: any) => {
    setEditId(note._id);
    setTitle(note.title || "");
    setBody(note.body || "");
  };

  return (
   <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
  
  {/* Header Section */}
  <div className="flex justify-between items-end mb-10 px-2">
    <div>
      <h1 className="text-3xl font-black text-black tracking-tighter">Today's Notes</h1>
      <p className="text-zinc-400 text-sm font-medium mt-1 uppercase tracking-widest">Focus on what matters</p>
    </div>
    <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200">
      <Pencil size={24} className="text-white rotate-12" />
    </div>
  </div>

  {/* Main Note Container */}
  <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
    
    <div className="flex items-center gap-3 mb-8">
      <div className="w-2 h-8 bg-orange-500 rounded-full" />
      <h2 className="text-xl font-bold text-black italic">
        {editId ? "Refining Thought..." : "Capture Idea"}
      </h2>
    </div>

    {/* Input Area */}
    <div className="flex flex-col md:flex-row gap-4 mb-10">
      <div className="flex-1 flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={editId ? "Update note title..." : "Note title..."}
          className="w-full px-5 py-4 bg-zinc-50 border border-transparent rounded-2xl outline-none text-base font-bold placeholder:text-zinc-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50/50 transition-all"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's the detail?"
          className="w-full px-5 py-4 bg-zinc-50 border border-transparent rounded-2xl outline-none text-sm placeholder:text-zinc-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50/50 transition-all resize-none min-h-[100px]"
        />
      </div>
      
      <button
        onClick={editId ? handleUpdate : handleAdd}
        className={`self-start md:self-stretch px-8 py-4 ${
          editId ? "bg-orange-500" : "bg-black"
        } text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest shadow-xl ${
          editId ? "shadow-orange-200" : "shadow-zinc-200"
        }`}
      >
        {editId ? "Update" : "Add"}
      </button>
    </div>

    {/* Notes List Area */}
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 whitespace-nowrap">Your Feed</span>
        <div className="h-[1px] w-full bg-zinc-100" />
      </div>

      {notes.length === 0 ? (
        <div className="py-12 text-center bg-zinc-50 rounded-[2rem] border border-dashed border-zinc-200">
          <p className="text-zinc-400 text-sm italic font-medium">Your canvas is currently blank.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note: any) => (
            <div
              key={note._id}
              className={`group relative p-6 rounded-[2rem] transition-all duration-500 border ${
                editId === note._id 
                  ? "bg-orange-50 border-orange-200 shadow-inner" 
                  : "bg-white border-zinc-50 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-500/5"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className={`text-lg font-black leading-tight ${
                    editId === note._id ? "text-orange-600" : "text-black"
                  }`}>
                    {note.title || "Untitled"}
                  </h3>
                  <p className="text-zinc-500 text-sm mt-2 leading-relaxed font-medium">
                    {note.body}
                  </p>
                </div>

                <div className="flex gap-1 ml-4 transition-all group-hover:opacity-100 opacity-0 transform translate-x-2 group-hover:translate-x-0">
                  <button
                    className="p-3 text-zinc-400 hover:text-orange-500 hover:bg-orange-100 rounded-xl transition-all"
                    onClick={() => {
                      setEditId(note._id);
                      setTitle(note.title || "");
                      setBody(note.body || "");
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    onClick={() => removeNote(note._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {/* Subtle visual indicator for active edit */}
              {editId === note._id && (
                <div className="absolute top-4 right-4 animate-pulse">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
  );
}