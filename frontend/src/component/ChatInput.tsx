import React, { useEffect, useRef } from "react";
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
 const textareaRef = useRef<HTMLTextAreaElement>(null);

const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const el = textareaRef.current;
  if (!el) return;

  // reset height first
  el.style.height = "auto";

  // set new height based on scrollHeight
  el.style.height = el.scrollHeight + "px";
};
 
    return (
      <div className="sticky bottom-0 bg-background border-t px-3 py-3 sm:px-6 sm:py-4">

        {/* Quick Actions (VERY IMPORTANT FOR STUDENTS) */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {[
            "Explain concept",
            "Solve question",
            "Give formula",
            "Revise notes",
          ].map((item) => (
            <button
              key={item}
              onClick={() => {textareaRef.current?.focus() ; setUserInput(item) }}
              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-zinc-700 transition"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 sm:gap-3">

          {/* File Upload */}
          <label className="cursor-pointer flex items-center">
            <Paperclip className="text-muted-foreground hover:text-primary mb-2" />
            <Input
            
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>

          {/* Textarea */}
          <textarea
          ref={textareaRef}
    rows={1}
            value={userInput}
            onChange={(e) => {  setUserInput(e.target.value)  } }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onClick={()=>handleInput}
            placeholder="Ask Physics, Chemistry, Maths… (e.g. ‘Explain Kirchhoff law’)"
            className="
           md:w-[60vw] resize-none rounded-xl   
          px-3 py-2 sm:px-4 sm:py-3 b order bg-gray-300 
          text-md text-black placeholder:text-gray-400
          focus:outline-none focus:ring-0 caret-gray-600 focus:ring-zinz-600 focus:ring-offset-0 focus:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 
        "
          />

          {/* Send Button */}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isUploading}
            className="h-10 w-10 rounded-xl bg-primary hover:scale-105 transition"
          >
            <ArrowUp />
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-[11px] text-muted-foreground mt-1">
          Tip: Upload a question image or ask for step-by-step solutions.
        </p>
      </div>
    );
  }
);

export default ChatInput;