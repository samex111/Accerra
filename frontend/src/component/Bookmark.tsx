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
  <div className="w-full h-full flex flex-col px-4 py-4 md:px-6">

    {/* Mobile title */}
    <div className="md:hidden mb-3">
      <h2 className="text-lg font-semibold">Bookmarked Questions</h2>
    </div>

    {/* Desktop title */}
    <div className="hidden md:block mb-4">
      <h2 className="text-2xl font-bold">Bookmarked Questions</h2>
    </div>

    {bookmarkQuestions.length > 0 ? (
      <div className="space-y-3">
        {bookmarkQuestions.map((q) => (
          <div
            key={q._id}
            className="flex items-start justify-between gap-3 rounded-lg border bg-white p-4 shadow-sm"
          >
            <p className="text-sm md:text-base text-gray-800 flex-1">
              {q.question}
            </p>

            <Bookmark
              className="shrink-0 cursor-pointer text-gray-600 hover:text-red-500"
              onClick={() => removeBookmark(q._id)}
            />
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500">
        No bookmarked questions yet.
      </p>
    )}
  </div>
);

}
