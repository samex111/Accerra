import { useEffect, useState } from "react";
import { useBookmarkStore } from "@/hooks/useBookmarkStore";
import { Bookmark, Divide } from "lucide-react";

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
  const [msgBookmark, setMsgBookmark] = useState(false)
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
          {bookmarkQuestions.map((q,i) => (
            <div
              key={q._id}
              className="flex items-start justify-between gap-3  rounded-lg border bg-white p-8 shadow-sm"
            >
              <p className="text-sm  md:text-base text-gray-800 flex-1">
               <span>{i+1}.</span> {q.question}
              </p>
              <div className="relative shrink-0 flex flex-col items-center group">
                <Bookmark
                  className="cursor-pointer fill-black hover:fill-white"
                  onClick={() => removeBookmark(q._id)}
                />

                {/* Tooltip */}
                <p
                  className="
                   absolute top-full mt-1
                   text-sm text-black/70
                   opacity-0
                   -translate-y-2
                   group-hover:opacity-100
                   group-hover:translate-y-0
                   transition-all duration-200 ease-out
                   pointer-events-none
                   whitespace-nowrap
                 "
                >
                  remove bookmark
                </p>
              </div>



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
