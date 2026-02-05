"use client";

import { useState, useRef, useEffect } from "react";
import { useAI, AIMessage } from "@/hooks";
import { AIAssistResponse } from "@/lib/api";

interface AIChatInputProps {
  onTaskCreated?: (response: AIAssistResponse) => void;
}

export default function AIChatInput({ onTaskCreated }: AIChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, isProcessing, error, sendMessage, clearMessages, clearError } =
    useAI({
      onTaskCreated,
    });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const message = inputValue;
    setInputValue("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === "Escape") {
      setIsExpanded(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative">
      {/* Collapsed View - Input Bar */}
      {!isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          className="bg-obsidian-gray-900 border border-obsidian-gray-700 rounded-xl p-4 cursor-pointer hover:border-obsidian-violet-primary/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-obsidian-violet-primary/10 flex items-center justify-center text-obsidian-violet-primary">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Type a task in natural language...
              </p>
              <p className="text-xs text-gray-600">
                e.g., &quot;Buy groceries tomorrow, high priority&quot;
              </p>
            </div>
            <svg
              className="w-5 h-5 text-gray-500 group-hover:text-obsidian-violet-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Expanded View - Chat Interface */}
      {isExpanded && (
        <div className="bg-obsidian-gray-900 border border-obsidian-violet-primary/30 rounded-xl overflow-hidden glow-violet slide-down">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-obsidian-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-obsidian-violet-primary flex items-center justify-center text-white">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AI Task Assistant</h3>
                <p className="text-xs text-gray-500">Powered by GPT-4</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-obsidian-gray-800 transition-all"
                  title="Clear chat"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-obsidian-gray-800 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="max-h-64 overflow-y-auto p-4 space-y-4"
          >
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-obsidian-gray-800 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-obsidian-violet-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">
                  Describe your task naturally
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  I&apos;ll extract title, priority, tags, and more
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} formatTime={formatTime} />
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-obsidian-violet-light">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-obsidian-violet-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-obsidian-violet-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-obsidian-violet-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-obsidian-danger/10 border border-obsidian-danger/30 text-obsidian-danger text-sm">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
                <button
                  onClick={clearError}
                  className="ml-auto text-obsidian-danger hover:text-red-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-obsidian-gray-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your task..."
                disabled={isProcessing}
                className="flex-1 bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputValue.trim()}
                className="px-4 py-2.5 rounded-lg bg-obsidian-violet-primary text-white font-medium hover:bg-obsidian-violet-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Press Enter to send • Escape to minimize
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Message Bubble Component
// ============================================================================

function MessageBubble({
  message,
  formatTime,
}: {
  message: AIMessage;
  formatTime: (date: Date) => string;
}) {
  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-obsidian-violet-primary text-white rounded-xl rounded-br-sm px-4 py-2">
          <p className="text-sm">{message.content}</p>
          <p className="text-xs text-white/60 mt-1">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  if (message.type === "error") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[80%] bg-obsidian-danger/10 border border-obsidian-danger/30 text-obsidian-danger rounded-xl rounded-bl-sm px-4 py-2">
          <p className="text-sm">{message.content}</p>
          <p className="text-xs text-obsidian-danger/60 mt-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] bg-obsidian-gray-800 border border-obsidian-gray-700 text-white rounded-xl rounded-bl-sm px-4 py-2">
        <p className="text-sm text-gray-300">{message.content}</p>

        {/* Task Created Card */}
        {message.taskCreated && (
          <div className="mt-3 p-3 rounded-lg bg-obsidian-gray-900 border border-obsidian-success/30">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-obsidian-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-medium text-obsidian-success">
                Task Created
              </span>
            </div>
            <p className="text-sm font-medium text-white">
              {message.taskCreated.title}
            </p>
            {message.taskCreated.description && (
              <p className="text-xs text-gray-400 mt-1">
                {message.taskCreated.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${
                  message.taskCreated.priority === "high"
                    ? "bg-obsidian-danger/10 text-obsidian-danger border-obsidian-danger/30"
                    : message.taskCreated.priority === "medium"
                      ? "bg-obsidian-warning/10 text-obsidian-warning border-obsidian-warning/30"
                      : "bg-obsidian-success/10 text-obsidian-success border-obsidian-success/30"
                }`}
              >
                {message.taskCreated.priority}
              </span>
              {message.taskCreated.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-obsidian-gray-800 text-obsidian-violet-light"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-600 mt-2">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
}
