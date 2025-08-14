import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Plus, Settings, User } from "lucide-react";
import EiQLogo from "@/components/common/EiQLogo";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ChatLayoutProps {
  title: string;
  subtitle?: string;
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  sidebar?: ReactNode;
  children?: ReactNode;
  className?: string;
  renderMessage?: (message: ChatMessage) => ReactNode;
}

export default function ChatLayout({
  title,
  subtitle,
  messages = [],
  onSendMessage,
  isLoading = false,
  sidebar,
  children,
  className = "",
  renderMessage
}: ChatLayoutProps) {
  const [inputMessage, setInputMessage] = useState("");

  const handleSend = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex ${className}`}>
      {/* Sidebar */}
      {sidebar && (
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Logo */}
            <div className="flex items-center px-4 py-6 border-b border-gray-200 dark:border-gray-700">
              <EiQLogo size="sm" variant="compact" />
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-hidden">
              {sidebar}
            </div>

            {/* User Menu */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Student
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    EiQ™ Assessment
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/chat'}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Chat Messages or Custom Content */}
        <div className="flex-1 flex flex-col">
          {children ? (
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 dark:text-gray-600 mb-4">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <EiQLogo size="sm" variant="compact" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        How can I help you today?
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Start a conversation about assessments, learning, or AI tutoring.
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex space-x-4">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback>
                            {message.role === "user" ? "U" : "AI"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {message.role === "user" ? "You" : "EiQ™ Assistant"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="prose dark:prose-invert max-w-none">
                            {renderMessage ? renderMessage(message) : (
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {message.content}
                              </p>
                            )}
                          </div>
                          {message.metadata?.badges && (
                            <div className="flex flex-wrap gap-1">
                              {message.metadata.badges.map((badge: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="flex space-x-4">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            EiQ™ Assistant
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              {onSendMessage && (
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          disabled={isLoading}
                          className="resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                      <Button
                        onClick={handleSend}
                        disabled={!inputMessage.trim() || isLoading}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}