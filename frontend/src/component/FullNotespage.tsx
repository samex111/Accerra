import { useEffect, useState , useRef} from "react";
import { useNotesStore } from "@/hooks/useNotes";
import { Trash2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Notes() {
  const { notes, fetchNotes, addNotes, removeNote, updateNote } =
    useNotesStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCreate , setIsCreate] = useState(false);

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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">

      {/* HEADER */}
      <div className="flex justify-end items-end mb-10 px-2">
             <Dialog>
      {/* Trigger button (optional - customize as needed) */}
      <DialogTrigger asChild>
                  <Button onClick={()=>setIsCreate(!isCreate)} className="bg-orange-400">+ Create note</Button>

      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-3xl">
        {/* HEADER */}
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold">
              {editId ? "Edit Note" : "New Note"}
            </DialogTitle>

            {editId && (
              <button
                onClick={resetForm}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-black transition"
              >
                <X size={14} /> Cancel
              </button>
            )}
          </div>
        </DialogHeader>

        {/* INPUT */}
        <div className="flex flex-col gap-3 my-4">
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
      </DialogContent>
    </Dialog>
      </div>

     <div className="rounded-3xl p-6">
  {notes.length === 0 ? (
    <div className="text-center py-10 text-zinc-400 text-sm">
      No notes yet. Start writing 🚀
    </div>
  ) : (
    <div className="space-y-3">
     
{notes.map((note: any) => {
  const isEditing = editId === note._id;

  return (
    <div
      key={note._id}
      onClick={() => {
        setEditId(note._id);
        setTitle(note.title || "");
        setBody(note.body || "");
      }}
      className={`group cursor-pointer flex-1 w-full h-[20vh] border rounded-2xl p-4 transition-all
        ${
          isEditing
            ? "border-orange-300 bg-orange-50"
            : "border-zinc-200 hover:shadow-sm"
        }
      `}
    >
      <div className="flex justify-between">
        <div className="w-full">
          {/* TITLE */}
          {isEditing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full font-bold text-black text-md bg-transparent outline-none"
              placeholder="Title"
            />
          ) : (
            <h3 className="font-bold text-black text-md">
              {note.title || "Untitled"}
            </h3>
          )}

          {/* BODY */}
          {isEditing ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-zinc-500 text-md mt-1 bg-transparent outline-none resize-none"
              rows={3}
              placeholder="Write something..."
            />
          ) : (
            <p className="text-zinc-500 text-md mt-1 line-clamp-3">
              {note.body}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex gap-1 opacity-0 group-hover:opacity-100 transition"
        >
          <button
            onClick={() => removeNote(note._id)}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* SAVE BUTTON (only when editing) */}
      {isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit(); // update note
          }}
          className="   ml-[60vw]  px-3  py-2 text-md bg-orange-500 text-black rounded-lg"
        >
          Save
        </button>
      )}
    </div>
  );
})}
    </div>
  )}
</div>
    
    </div>
  );
}