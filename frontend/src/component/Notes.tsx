import { useEffect, useState } from "react";
import { useNotesStore } from "@/hooks/useNotes";
import { Bookmark, Trash2, Pencil } from "lucide-react";

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
    <div className="w-full h-full flex flex-col px-4 py-4 md:px-6 gap-6">
      
      {/* Add / Edit Section */}
      <div className="  p-4 rounded-xl flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="bg-white text-black"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your note..."
          className="bg-white text-black"
        />

        {editId ? (
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 text-black py-2 rounded"
          >
            Update Note
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-blue-500 py-2 rounded"
          >
            Add Note
          </button>
        )}
      </div>

      {/* Notes List */}
      <div className="flex flex-col gap-4">
        {notes.length === 0 && (
          <p className="text-zinc-400">No notes found</p>
        )}

        {notes.map((note: any) => (
          <div
            key={note.id}
            className="bg-zinc-900 p-4 rounded-xl flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold text-lg">
                {note.title || "Untitled"}
              </h3>
              <p className="text-sm text-zinc-300 mt-1">
                {note.body}
              </p>
            </div>

            <div className="flex gap-3">
              {/* Edit */}
              <button
                onClick={() => {
                  setEditId(note.id);
                  setTitle(note.title || "");
                  setBody(note.body || "");
                }}
              >
                <Pencil size={18} />
              </button>

              {/* Delete */}
              <button onClick={() => removeNote(note.id)}>
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}