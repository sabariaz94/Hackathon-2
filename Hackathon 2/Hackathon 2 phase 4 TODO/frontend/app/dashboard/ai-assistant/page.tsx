"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authApi, chatApi, Conversation, Message } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard";
import {
  ChatHistory,
  MessageBubble,
  TypingIndicator,
  ChatInput,
} from "@/components/chat";

export default function AIAssistantPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth state
  const [username, setUsername] = useState<string>("User");
  const [userId, setUserId] = useState<string>("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Chat state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await authApi.me();
      if (error) {
        router.push("/login");
        return;
      }
      if (data) {
        setUsername(data.name || data.email);
        setUserId(data.id);
      }
      setIsAuthLoading(false);
    };

    checkAuth();
  }, [router]);

  // Load conversations when userId is available
  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!userId) return;

    setIsLoadingConversations(true);
    setError(null);

    const { data, error } = await chatApi.getConversations(userId);
    if (error) {
      setError(error);
    } else if (data) {
      setConversations(data);
    }
    setIsLoadingConversations(false);
  }, [userId]);

  // Load messages for a conversation
  const loadConversation = useCallback(
    async (conversationId: string) => {
      if (!userId) return;

      setIsLoadingMessages(true);
      setError(null);
      setCurrentConversationId(conversationId);
      setIsSidebarOpen(false); // Close mobile sidebar

      const { data, error } = await chatApi.getConversation(userId, conversationId);
      if (error) {
        setError(error);
        setMessages([]);
      } else if (data) {
        setMessages(data);
      }
      setIsLoadingMessages(false);
    },
    [userId]
  );

  // Start new chat
  const handleNewChat = useCallback(() => {
    setCurrentConversationId(undefined);
    setMessages([]);
    setError(null);
    setIsSidebarOpen(false);
  }, []);

  // Delete conversation
  const handleDeleteConversation = useCallback(
    async (conversationId: string) => {
      if (!userId) return;

      const { error } = await chatApi.deleteConversation(userId, conversationId);
      if (error) {
        setError(error);
      } else {
        // Remove from list and clear if it was current
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
        if (currentConversationId === conversationId) {
          handleNewChat();
        }
      }
    },
    [userId, currentConversationId, handleNewChat]
  );

  // Send message
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!userId || !content.trim()) return;

      setError(null);
      setIsSending(true);

      // Optimistic update - add user message immediately
      const optimisticUserMessage: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: content.trim(),
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticUserMessage]);

      // Send to API
      const { data, error } = await chatApi.sendMessage(
        userId,
        content.trim(),
        currentConversationId
      );

      if (error) {
        setError(error);
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMessage.id));
      } else if (data) {
        // Update conversation ID if this was a new chat
        if (!currentConversationId) {
          setCurrentConversationId(data.conversation_id);
          // Refresh conversations list to show new conversation
          loadConversations();
        }

        // Add assistant response
        const assistantMessage: Message = {
          id: data.message_id,
          role: "assistant",
          content: data.response,
          tool_calls: data.tool_calls.length > 0 ? { calls: data.tool_calls } : undefined,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }

      setIsSending(false);
    },
    [userId, currentConversationId, loadConversations]
  );

  // Handle logout
  const handleLogout = useCallback(async () => {
    await authApi.logout();
    router.push("/");
  }, [router]);

  // Loading state
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <Sidebar username={username} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="ml-64 h-screen flex">
        {/* Mobile Chat History Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-68 z-50 p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Chat History Sidebar - 30% width */}
        <aside
          className={`w-80 border-r border-zinc-800 flex-shrink-0 ${
            isSidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <ChatHistory
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={loadConversation}
            onNewChat={handleNewChat}
            onDeleteConversation={handleDeleteConversation}
            loading={isLoadingConversations}
          />
        </aside>

        {/* Chat Area - 70% width */}
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <header className="h-16 border-b border-zinc-800 flex items-center px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
                <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
                <p className="text-xs text-zinc-500">
                  Manage your tasks with natural language
                </p>
              </div>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto hover:text-red-300"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {messages.length === 0 && !isLoadingMessages && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center px-4"
              >
                <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-purple-500"
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
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  How can I help you today?
                </h2>
                <p className="text-zinc-400 max-w-md mb-8">
                  I can help you manage your tasks. Try asking me to create,
                  view, update, or complete tasks using natural language.
                </p>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Add a task to buy groceries tomorrow",
                    "Show all my pending tasks",
                    "Mark my latest task as complete",
                    "What tasks do I have for this week?",
                  ].map((suggestion) => (
                    <motion.button
                      key={suggestion}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-sm text-zinc-300 hover:text-white transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Loading Messages */}
            {isLoadingMessages && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-zinc-400 text-sm">Loading messages...</p>
                </div>
              </div>
            )}

            {/* Messages */}
            {!isLoadingMessages && messages.length > 0 && (
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}

                {/* Typing Indicator */}
                {isSending && <TypingIndicator />}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={isLoadingMessages}
            loading={isSending}
            placeholder="Ask me to manage your tasks..."
          />
        </div>
      </main>
    </div>
  );
}
