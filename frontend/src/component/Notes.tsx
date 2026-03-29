import { useEffect, useState } from "react";
import { useNotesStore } from "@/hooks/useNotes";
import { Bookmark, Trash2, Pencil } from "lucide-react";
import { notesData } from "@/types/notesTypes";

export default function Notes() {
  const {
    notes,
    fetchNotes,
    addNotes,
    removeNote,
    updateNote,
  } = useNotesStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAdd = async () => {
    if (!body.trim()) return;
    await addNotes({ title, body } );
    setTitle("");
    setBody("");
  };

  const handleUpdate = async () => {
    if (!editId) return;
    await updateNote(editId, { title, body });
    setEditId(null);
    setTitle("");
    setBody("");
  };

  return (
   <div className="w-full h-full flex flex-col px-4 py-8 md:px-12 lg:px-24 gap-10 bg-white min-h-screen">
  
  {/* Add / Edit Section */}
  <div className="bg-white border border-zinc-200 shadow-sm p-6 rounded-2xl flex flex-col gap-4 transition-all focus-within:ring-1 focus-within:ring-zinc-400">
    <h2 className="text-zinc-900 font-medium text-sm uppercase tracking-wider">
      {editId ? "Edit Note" : "New Note"}
    </h2>
    
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Title (optional)"
      className="bg-transparent text-zinc-900 text-lg font-semibold outline-none placeholder:text-zinc-400"
    />

    <textarea
      value={body}
      onChange={(e) => setBody(e.target.value)}
      placeholder="Write your note..."
      className="bg-transparent text-zinc-600 outline-none resize-none min-h-[100px] placeholder:text-zinc-400"
    />

    <div className="flex justify-end pt-2">
      {editId ? (
        <button
          onClick={handleUpdate}
          className="bg-zinc-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
        >
          Update Note
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="bg-zinc-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
        >
          Add Note
        </button>
      )}
    </div>
  </div>

  {/* Notes List */}
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
       <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Your Collection</span>
       <span className="text-zinc-400 text-xs">{notes.length} notes</span>
    </div>

    {notes.length === 0 && (
      <div className="py-12 text-center">
        <p className="text-zinc-400 italic">No notes found</p>
      </div>
    )}

    <div className="grid grid-cols-1 gap-4">
     
      {notes.map((note: notesData['data'][0]) => (
         
        <div
          key={note._id} 
          className="group bg-white border border-zinc-100 p-5 rounded-2xl flex justify-between items-start hover:border-zinc-300 hover:shadow-md transition-all"
        >
          <div className="flex-1">
            <h3 className="font-bold text-zinc-900 text-lg">
              {note.title || "Untitled"} 
            </h3>
            <p className="text-zinc-500 mt-2 leading-relaxed">
              {note.body}  
            </p>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
            {/* Edit */}
            <button
              className="p-2 hover:bg-zinc-100 rounded-full text-zinc-600 transition-colors"
              onClick={() => {
                setEditId(note._id);
                setTitle(note.title || "");
                setBody(note.body || "");
              }}
            >
              <Pencil size={18} />
            </button>

            {/* Delete */}
            <button 
              className="p-2 hover:bg-red-50 rounded-full text-zinc-400 hover:text-red-500 transition-colors"
              onClick={() => removeNote(note._id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}