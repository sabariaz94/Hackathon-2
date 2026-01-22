// Types for chat functionality

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant'; // 'user' for user messages, 'assistant' for AI responses
  timestamp: Date;
  status?: 'sent' | 'sending' | 'error'; // Status for message delivery
}

export interface Conversation {
  id: number;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  message: string;
  conversation_id: number | null;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls?: any[]; // Any tool calls made by the assistant
}