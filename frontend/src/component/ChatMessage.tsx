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
        rounded-2xl px-5 py-3 sm:px-6 sm:py-4
        text-sm leading-relaxed
        ${isUser
          ? "bg-gray-300 text-gray-800"
          : "bg-white text-gray-900"}
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg font-semibold mt-2 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-md font-semibold mt-2 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>
          ),

          p: ({ children }) => (
            <p className="mb-2 leading-relaxed text-gray-300">{children}</p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
          ),

          li: ({ children }) => <li className="text-gray-300">{children}</li>,

          code: ({ inline, children }) =>
            inline ? (
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                {children}
              </code>
            ) : (
              <pre className="bg-black/80 rounded-xl p-4 text-xs overflow-x-auto border border-white/10">
                <code className="text-green-400">{children}</code>
              </pre>
            ),

          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
        }}
      >
        {msg.role === "assistant" && !msg.content
          ? "Thinking…"
          : msg.content}
      </ReactMarkdown>

      {/* typing cursor */}
      {msg.role === "assistant" && isLast && msg.content && (
        <span className="inline-block w-[2px] h-4 bg-white animate-pulse ml-1 align-middle" />
      )}
    </div>
  </div>
);
});

export default ChatMessage;