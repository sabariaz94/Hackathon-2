"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Conversation } from "@/lib/api";

interface ChatHistoryProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (conversationId: string) => void;
  loading?: boolean;
}

/**
 * Format timestamp to relative time (Just now, 2 hours ago, Yesterday, etc.)
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ChatHistory({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  loading = false,
}: ChatHistoryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-zinc-900/50 border-r border-zinc-800">
      {/* Header with New Chat button */}
      <div className="p-4 border-b border-zinc-800">
        <motion.button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Chat
        </motion.button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-zinc-800/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-zinc-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-2 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs text-zinc-600 mt-1">
              Start a new chat to begin
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {conversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group cursor-pointer border-b border-zinc-800/50 ${
                  currentConversationId === conversation.id
                    ? "bg-purple-600/10 border-l-4 border-l-purple-500"
                    : "hover:bg-zinc-800/50"
                }`}
                onMouseEnter={() => setHoveredId(conversation.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <motion.div
                  className="p-4"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`font-medium truncate ${
                        currentConversationId === conversation.id
                          ? "text-purple-300"
                          : "text-zinc-200"
                      }`}
                    >
                      {conversation.title}
                    </h3>
                    <span className="text-xs text-zinc-500 whitespace-nowrap">
                      {formatRelativeTime(conversation.updated_at)}
                    </span>
                  </div>
                  {conversation.last_message && (
                    <p className="text-sm text-zinc-500 truncate mt-1">
                      {conversation.last_message}
                    </p>
                  )}
                </motion.div>

                {/* Delete button on hover */}
                <AnimatePresence>
                  {hoveredId === conversation.id && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
