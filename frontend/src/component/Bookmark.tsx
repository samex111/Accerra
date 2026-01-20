import { useEffect } from "react";
import { useBookmarkStore } from "@/hooks/useBookmarkStore";
import { Bookmark } from "lucide-react";

export default function Bookmarks() {
  const {
    bookmarks,
    bookmarkQuestions,
    fetchBookmarks,
    fetchBookmarkQuestion,
    removeBookmark,
  } = useBookmarkStore();

  // 🧠 1️⃣ Load bookmarks when component mounts
  useEffect(() => {
    const loadData = async () => {
      await fetchBookmarks();             // Fetch only IDs first
      await fetchBookmarkQuestion();      // Then fetch full question details
    };
    loadData();
  }, []); // only run once

  return (
    <div className=" w-full ">
      <h2 className="text-2xl font-bold mb-4">Bookmarked Questions</h2>

      {bookmarkQuestions.length > 0 ? (
        bookmarkQuestions.map((q, i) => (
          <div
            key={q._id || i}
            className="flex items-center justify-between p-3 mb-3 bg-white rounded-md shadow border"
          >
            <p className="text-gray-800 w-[70vw] font-medium">{q.question}</p>
            <Bookmark
              fill=""
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
