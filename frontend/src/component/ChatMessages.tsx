import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface Props {
  messages: Message[];
}

const ChatMessages: React.FC<Props> = React.memo(({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div
      className="
        flex-1 overflow-y-auto
        px-3 py-4
        sm:px-6 sm:py-6
        space-y-4 sm:space-y-6 min-h-0
      "
    >
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          msg={msg}
          isLast={i === messages.length - 1}
        />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
});

export default ChatMessages;