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
    console.log("Updating note with ID:", editId, "Title:", title, "Body:", body);
    if (!editId) return;
    await updateNote(editId, { title, body });
    setEditId(null);
    setTitle("");
    setBody("");
  };

  return (
  <div className=" ">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold text-black">Today's Notes</h1>
      <Pencil size={20} className="text-zinc-400 rotate-12" />
    </div>

    {/* Main Note Container */}
    <div className="border border-zinc-100 rounded-3xl p-6 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Pencil size={18} className="text-black -rotate-90" />
        <h2 className="text-lg font-bold text-black">Note List</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="flex-1 flex flex-col gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={editId ? "Update title..." : "Add a title..."}
            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none text-sm placeholder:text-zinc-400 focus:border-zinc-400 transition-all"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write details..."
            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none text-sm placeholder:text-zinc-400 focus:border-zinc-400 transition-all resize-none min-h-[60px]"
          />
        </div>
        
        <button
          onClick={editId ? handleUpdate : handleAdd}
          className="self-start px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-black transition-colors text-sm"
        >
          {editId ? "Save" : "Add"}
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-zinc-400 text-sm">No notes for today</p>
        ) : (
          notes.map((note: any) => (
            <div
              key={note._id}
              className={`group relative border-b border-zinc-50 pb-4 last:border-0 transition-all ${
                editId === note._id ? "bg-zinc-50/50 p-3 rounded-xl ring-1 ring-zinc-100" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className={`font-bold text-black ${editId === note._id ? "text-zinc-400 italic" : ""}`}>
                    {note.title || "Untitled"}
                  </h3>
                  <p className="text-zinc-500 text-sm mt-1">{note.body}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    className="text-zinc-300 hover:text-black transition-colors"
                    onClick={() => {
                      setEditId(note._id);
                      setTitle(note.title || "");
                      setBody(note.body || "");
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    className="text-zinc-300 hover:text-red-500 transition-colors"
                    onClick={() => removeNote(note._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
</div>
  );
}