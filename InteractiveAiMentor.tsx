import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, User, Sparkles, MessageCircle, Heart, Brain, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MentorPersonality {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insights?: string[];
  suggestions?: string[];
}

interface InteractiveAiMentorProps {
  currentStep: number;
  onStepGuidance: (guidance: string) => void;
  onInsightsUpdate: (insights: string[]) => void;
  onSuggestionsUpdate: (suggestions: string[]) => void;
  userContext: {
    age?: number;
    educationalLevel?: string;
    gradeLevel?: string;
    userResponses?: Record<string, any>;
  };
  onMentorChange: (mentorId: string) => void;
  selectedMentor: string;
}

const mentorPersonalities: MentorPersonality[] = [
  {
    id: 'supportive',
    name: 'Alex',
    description: 'Supportive Guide',
    icon: <Heart className="w-4 h-4" />,
    color: 'bg-pink-500'
  },
  {
    id: 'challenging',
    name: 'Dr. Chen',
    description: 'Academic Challenger',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-blue-500'
  },
  {
    id: 'friendly',
    name: 'Sam',
    description: 'Friendly Companion',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-yellow-500'
  },
  {
    id: 'professional',
    name: 'Jordan',
    description: 'EiQ Score Coach',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-green-500'
  }
];

export default function InteractiveAiMentor({
  currentStep,
  onStepGuidance,
  onInsightsUpdate,
  onSuggestionsUpdate,
  userContext,
  onMentorChange,
  selectedMentor
}: InteractiveAiMentorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMentorSelection, setShowMentorSelection] = useState(true);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedMentorInfo = mentorPersonalities.find(m => m.id === selectedMentor) || mentorPersonalities[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedMentor && !hasGreeted) {
      initializeMentor();
    }
  }, [selectedMentor, hasGreeted]);

  const initializeMentor = async () => {
    if (hasGreeted) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-mentor/greeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          mentorPersonality: selectedMentor,
          context: userContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        const greeting: Message = {
          role: 'assistant',
          content: data.greeting,
          timestamp: new Date()
        };
        setMessages([greeting]);
        setHasGreeted(true);
        setShowMentorSelection(false);
      }
    } catch (error) {
      console.error('Failed to initialize mentor:', error);
      // Fallback greeting
      const fallbackGreeting: Message = {
        role: 'assistant',
        content: `Hi! I'm ${selectedMentorInfo.name}, your AI learning mentor. I'm excited to help guide you through your educational journey. What would you like to know about getting started?`,
        timestamp: new Date()
      };
      setMessages([fallbackGreeting]);
      setHasGreeted(true);
      setShowMentorSelection(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMentorSelection = (mentorId: string) => {
    onMentorChange(mentorId);
    setShowMentorSelection(false);
    setMessages([]);
    setHasGreeted(false);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: currentMessage,
          mentorPersonality: selectedMentor,
          context: {
            ...userContext,
            currentStep,
            conversationHistory: messages.slice(-6) // Send recent context
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          insights: data.insights,
          suggestions: data.suggestions
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Update parent components with insights and suggestions
        if (data.insights?.length) {
          onInsightsUpdate(data.insights);
        }
        if (data.suggestions?.length) {
          onSuggestionsUpdate(data.suggestions);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Could you try asking your question again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (showMentorSelection) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-green-500" />
            Choose Your AI Mentor
          </CardTitle>
          <p className="text-gray-400">
            Select a mentor personality that matches your learning style. You can change this anytime.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {mentorPersonalities.map((mentor) => (
              <Card
                key={mentor.id}
                className={cn(
                  "cursor-pointer transition-all hover:scale-[1.02] border-gray-700 bg-gray-900",
                  selectedMentor === mentor.id && "ring-2 ring-green-500"
                )}
                onClick={() => handleMentorSelection(mentor.id)}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={cn("text-white", mentor.color)}>
                      {mentor.icon}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{mentor.name}</h3>
                    <p className="text-gray-400 text-sm">{mentor.description}</p>
                  </div>
                  {selectedMentor === mentor.id && (
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button 
            onClick={() => initializeMentor()}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!selectedMentor}
          >
            Start Conversation with {selectedMentorInfo.name}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className={cn("text-white", selectedMentorInfo.color)}>
                {selectedMentorInfo.icon}
              </AvatarFallback>
            </Avatar>
            {selectedMentorInfo.name} - {selectedMentorInfo.description}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMentorSelection(true)}
            className="text-gray-400 hover:text-white"
          >
            Change Mentor
          </Button>
        </div>
        <Separator className="bg-gray-700" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ScrollArea 
          ref={scrollRef}
          className="h-80 w-full rounded border border-gray-700 bg-gray-900 p-4"
        >
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={cn("text-white", selectedMentorInfo.color)}>
                      {selectedMentorInfo.icon}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 text-sm",
                    message.role === 'user'
                      ? "bg-green-600 text-white ml-auto"
                      : "bg-gray-800 text-gray-100 border border-gray-700"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.insights?.length && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <p className="text-xs text-gray-400 mb-1">Insights:</p>
                      {message.insights.map((insight, i) => (
                        <Badge key={i} variant="secondary" className="mr-1 mb-1 text-xs">
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-600 text-white">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={cn("text-white", selectedMentorInfo.color)}>
                    {selectedMentorInfo.icon}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Ask ${selectedMentorInfo.name} anything...`}
            className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700 px-6"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          Your AI mentor adapts to your learning style and provides personalized guidance
        </div>
      </CardContent>
    </Card>
  );
}