import { useEffect, useState } from "react";
import { useNotesStore } from "@/hooks/useNotes";
import { Trash2, Pencil, X } from "lucide-react";

export default function Notes() {
  const { notes, fetchNotes, addNotes, removeNote, updateNote } =
    useNotesStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🚀 Fetch Notes on Mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // 🔄 Reset Form
  const resetForm = () => {
    setTitle("");
    setBody("");
    setEditId(null);
  };

  // ➕ Add / ✏️ Update Note
  const handleSubmit = async () => {
    if (!body.trim()) return;

    try {
      setLoading(true);

      if (editId) {
        await updateNote(editId, { title, body });
      } else {
        await addNotes({ title, body });
      }

      resetForm();
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Edit Mode
  const handleEdit = (note: any) => {
    setEditId(note._id);
    setTitle(note.title || "");
    setBody(note.body || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">

      {/* HEADER */}
      <div className="flex justify-between items-end mb-10 px-2">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">
            Notes
          </h1>
          <p className="text-zinc-400 text-xs uppercase tracking-widest mt-1">
            Capture • Think • Build
          </p>
        </div>

        <div className="bg-orange-500 p-3 rounded-2xl shadow-md">
          <Pencil size={22} className="text-white" />
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">

        {/* TITLE */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-black">
            {editId ? "Edit Note" : "New Note"}
          </h2>

          {editId && (
            <button
              onClick={resetForm}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-black transition"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>

        {/* INPUT */}
        <div className="flex flex-col gap-3 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="px-4 py-3 bg-zinc-50 rounded-xl border border-transparent focus:border-orange-400 focus:bg-white outline-none text-sm font-semibold transition"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your note..."
            className="px-4 py-3 bg-zinc-50 rounded-xl border border-transparent focus:border-orange-400 focus:bg-white outline-none text-sm resize-none min-h-[100px] transition"
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={loading || !body.trim()}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all
            ${
              loading || !body.trim()
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                : editId
                ? "bg-orange-500 text-white hover:scale-[1.01]"
                : "bg-black text-white hover:scale-[1.01]"
            }
          `}
        >
          {loading ? "Saving..." : editId ? "Update Note" : "Add Note"}
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-[1px] w-full bg-zinc-200" />
          <span className="text-[10px] uppercase text-zinc-400 tracking-widest">
            Notes
          </span>
          <div className="h-[1px] w-full bg-zinc-200" />
        </div>

        {/* LIST */}
        {notes.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-sm">
            No notes yet. Start writing 🚀
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note: any) => (
              <div
                key={note._id}
                className={`group border rounded-2xl p-4 transition-all
                  ${
                    editId === note._id
                      ? "border-orange-300 bg-orange-50"
                      : "border-zinc-200 hover:shadow-sm"
                  }
                `}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-black text-sm">
                      {note.title || "Untitled"}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-1">
                      {note.body}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-2 hover:bg-zinc-100 rounded-lg"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => removeNote(note._id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}