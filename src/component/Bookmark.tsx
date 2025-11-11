import { useBookmarkStore } from "@/hooks/useBookmarkStore";
import { Bookmark } from "lucide-react";

export default function Bookmarks() {
  const { bookmarks, bookmarkQuestions, removeBookmark } = useBookmarkStore();

  return (
    <div className="relative left-[16vw] p-4">
      <h2 className="text-2xl font-bold mb-4">Bookmarked Questions</h2>

      {bookmarkQuestions.length > 0 ? (
        bookmarkQuestions.map((q, i) => (
          <div
            key={q._id || i}
            className="flex items-center justify-between p-3 mb-3 bg-white rounded-md shadow border"
          >
            <p className="text-gray-800 font-medium">{q.question}</p>

            {/* Bookmark icon to unbookmark */}
            <Bookmark
              fill="#2563eb"
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => removeBookmark(q._id)}
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No bookmarked questions yet.</p>
      )}
    </div>
  );
}
