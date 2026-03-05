import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface Props {
  msg: Message;
  isLast: boolean;
}

const ChatMessage: React.FC<Props> = React.memo(({ msg, isLast }) => {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[85%] sm:max-w-[75%]
          rounded-2xl px-3 py-2 sm:px-4 sm:py-3
          text-sm leading-relaxed shadow  
          ${isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"}
        `}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({ inline, children }) =>
              inline ? (
                <code className="rounded bg-black/10 px-1 py-0.5 text-xs">
                  {children}
                </code>
              ) : (
                <pre className="rounded-lg bg-black p-3 text-xs text-white overflow-x-auto">
                  <code>{children}</code>
                </pre>
              ),
            p: ({ children }) => (
              <p className="mb-2 last:mb-0">{children}</p>
            ),
          }}
        >
          {msg.role === "assistant" && !msg.content
            ? "Thinking…"
            : msg.content}
        </ReactMarkdown>

        {msg.role === "assistant" && isLast && msg.content && (
          <span className="inline-block w-2 h-4 bg-muted-foreground animate-pulse ml-1 align-middle">
            ▍
          </span>
        )}
      </div>
    </div>
  );
});

export default ChatMessage;