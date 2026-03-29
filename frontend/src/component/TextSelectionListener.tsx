import { useEffect, useState } from "react";

export default function TextSelectionListener({ onAdd }: any) {
  const [selection, setSelection] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseUp = () => {
      const selectedText = window.getSelection()?.toString().trim();

      if (selectedText) {
        const range = window.getSelection()?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setPosition({
            x: rect.right,
            y: rect.bottom + window.scrollY,
          });
        }

        setSelection(selectedText);
      } else {
        setSelection("");
      }
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!selection) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: position.y + 8,
        left: position.x,
      }}
      className="z-50"
    >
      <button
        onClick={() => {
          onAdd(selection);
          setSelection("");
        }}
        className="bg-black text-white px-4 py-2 rounded-lg text-xs shadow-lg hover:bg-orange-500 transition"
      >
        + Add Note
      </button>
    </div>
  );
}