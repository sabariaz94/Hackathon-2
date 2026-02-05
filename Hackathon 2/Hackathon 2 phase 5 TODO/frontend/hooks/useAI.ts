"use client";

import { useState, useCallback } from "react";
import { aiApi, AIAssistResponse, Task } from "@/lib/api";

// ============================================================================
// Types
// ============================================================================

export interface AIMessage {
  id: string;
  type: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
  taskCreated?: AIAssistResponse;
}

export interface UseAIOptions {
  onTaskCreated?: (task: AIAssistResponse) => void;
}

export interface UseAIReturn {
  // State
  messages: AIMessage[];
  isProcessing: boolean;
  error: string | null;

  // Actions
  sendMessage: (message: string) => Promise<AIAssistResponse | null>;
  clearMessages: () => void;
  clearError: () => void;

  // Last response
  lastResponse: AIAssistResponse | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for AI Task Assistant integration
 *
 * Features:
 * - Send natural language messages to create tasks
 * - Message history for chat-like interface
 * - Loading and error states
 * - Rate limit handling (10 req/min)
 * - Callback when task is created
 *
 * @example
 * ```tsx
 * const { sendMessage, messages, isProcessing } = useAI({
 *   onTaskCreated: (task) => {
 *     // Refresh task list
 *     fetchTasks();
 *   },
 * });
 *
 * // Send a message
 * await sendMessage("Remind me to buy groceries tomorrow, high priority");
 * ```
 */
export function useAI(options: UseAIOptions = {}): UseAIReturn {
  const { onTaskCreated } = options;

  // State
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<AIAssistResponse | null>(null);

  // ========================================
  // Send Message
  // ========================================

  const sendMessage = useCallback(
    async (message: string): Promise<AIAssistResponse | null> => {
      if (!message.trim()) {
        setError("Please enter a message");
        return null;
      }

      setIsProcessing(true);
      setError(null);

      // Add user message to history
      const userMessage: AIMessage = {
        id: generateId(),
        type: "user",
        content: message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Call AI API
      const { data, error: apiError, status } = await aiApi.createFromMessage(message);

      if (apiError) {
        // Handle rate limiting
        if (status === 429) {
          setError("Rate limit reached. Please wait a moment before trying again.");
        } else {
          setError(apiError);
        }

        // Add error message to history
        const errorMessage: AIMessage = {
          id: generateId(),
          type: "error",
          content: apiError,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);

        setIsProcessing(false);
        return null;
      }

      if (data) {
        // Add assistant response to history
        const assistantMessage: AIMessage = {
          id: generateId(),
          type: "assistant",
          content: data.ai_interpretation,
          timestamp: new Date(),
          taskCreated: data,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        setLastResponse(data);

        // Call callback if provided
        if (onTaskCreated) {
          onTaskCreated(data);
        }
      }

      setIsProcessing(false);
      return data || null;
    },
    [onTaskCreated]
  );

  // ========================================
  // Clear Messages
  // ========================================

  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastResponse(null);
    setError(null);
  }, []);

  // ========================================
  // Clear Error
  // ========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ========================================
  // Return
  // ========================================

  return {
    // State
    messages,
    isProcessing,
    error,

    // Actions
    sendMessage,
    clearMessages,
    clearError,

    // Last response
    lastResponse,
  };
}

export default useAI;
