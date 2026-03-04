import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Paperclip } from "lucide-react";

interface Props {
  userInput: string;
  setUserInput: (v: string) => void;
  handleSend: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  isAnalyzing: boolean;
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInput: React.FC<Props> = React.memo(
  ({
    userInput,
    setUserInput,
    handleSend,
    handleFileUpload,
    isUploading,
    isAnalyzing,
    setIsAnalyzing,
  }) => {
    useEffect(() => {
 console.log("ChatInput props changed")
})
    return (
<div className="sticky bottom-0 flex-shrink-0 bg-background border-t px-3 py-2 sm:px-6 sm:py-4">
          <div className="flex items-end gap-2 sm:gap-3">

          <Button
            onClick={() => setIsAnalyzing((prev) => !prev)}
            size="sm"
            className="h-9"
          >
            {isAnalyzing ? "Analyzing" : "Analyze"}
          </Button>

          <label className="cursor-pointer flex items-center">
            <Paperclip className="text-muted-foreground hover:text-primary" />
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>

          <textarea
            rows={1}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message Accerra AI…"
            className="
              flex-1 resize-none rounded-xl bg-muted
              px-3 py-2 sm:px-4 sm:py-3
              text-sm focus:outline-none focus:ring-2 focus:ring-primary
            "
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={isUploading}
            className="h-9 w-9"
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    );
  }
);

export default ChatInput;