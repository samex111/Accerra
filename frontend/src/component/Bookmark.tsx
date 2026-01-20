import { useEffect } from "react";
import { useBookmarkStore } from "@/hooks/useBookmarkStore";
import { Bookmark } from "lucide-react";

export default function Bookmarks() {
  const {
    bookmarkQuestions,
    fetchBookmarks,
    fetchBookmarkQuestion,
    removeBookmark,
  } = useBookmarkStore();

  useEffect(() => {
    const loadData = async () => {
      await fetchBookmarks();
      await fetchBookmarkQuestion();
    };
    loadData();
  }, []);

  return (
    <div className="w-full px-4 py-4 md:px-6">
      
      {/* Page title */}
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Bookmarked Questions
      </h2>

      {/* List */}
      {bookmarkQuestions.length > 0 ? (
        <div className="space-y-3">
          {bookmarkQuestions.map((q, i) => (
            <div
              key={q._id || i}
              className="flex items-start justify-between gap-3 p-4 bg-white rounded-lg border shadow-sm"
            >
              <p className="text-gray-800 text-sm md:text-base font-medium flex-1">
                {q.question}
              </p>

              <Bookmark
                className="cursor-pointer text-gray-600 hover:text-red-500 transition"
                onClick={() => removeBookmark(q._id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          No bookmarked questions yet.
        </p>
      )}
    </div>
  );
}
