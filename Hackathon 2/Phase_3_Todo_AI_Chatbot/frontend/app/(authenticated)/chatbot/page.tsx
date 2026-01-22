'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { sendChatMessage } from '@/lib/api';
import { Message } from '@/types/chat';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Bot, User } from 'lucide-react';

export default function ChatbotPage() {
  const { token, user, session, loading } = useAuth(); // Add loading to destructuring
  const isLoggedIn = !!session; // Calculate isLoggedIn from session
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check auth status and redirect if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      // User is not authenticated, redirect to login
      router.push('/login');
    }
  }, [isLoggedIn, loading, router]);

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show redirecting message
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Add debug logging for token
  useEffect(() => {
    console.log("Chatbot Page - Token:", token);
    console.log("Chatbot Page - IsLoggedIn:", isLoggedIn);
    console.log("Chatbot Page - Session:", session);
  }, [token, isLoggedIn, session]);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        content: "Hi! I'm your Todo AI assistant. How can I help you with your tasks today?",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !token || isLoading) return;

    // Add user message to UI immediately
    const userMessage: Message = {
      id: 'user-' + Date.now(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Add debug logging before API call
      console.log("Sending token:", token);

      // Send message to backend
      const response = await sendChatMessage({
        message: inputValue,
        conversation_id: conversationId,
      }, token);

      // Update user message status to sent
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      // Add assistant response
      const assistantMessage: Message = {
        id: 'assistant-' + Date.now(),
        content: response.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationId(response.conversation_id);
    } catch (error) {
      console.error('Error sending message:', error);

      // Update user message status to error
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
      ));

      // Add error message
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        content: "Sorry, I encountered an error processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">Todo AI Assistant</h1>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
              message.status === 'error' ? 'opacity-70' : ''
            }`}
          >
            <div
              className={`flex items-start gap-2 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-full p-2 ${
                  message.role === 'user' ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Bot className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <Card
                className={`${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                } ${message.status === 'error' ? 'border-red-500' : ''}`}
              >
                <CardContent className="p-3 text-sm">
                  {message.content}
                  {message.status === 'error' && (
                    <span className="ml-2 text-xs opacity-70">(Failed to send)</span>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex items-start gap-2 max-w-[80%]">
              <div className="flex items-center justify-center rounded-full p-2 bg-secondary">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <Card className="bg-secondary">
                <CardContent className="p-3 text-sm">
                  <div className="flex space-x-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-2 w-2 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading || !token}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim() || !token}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}