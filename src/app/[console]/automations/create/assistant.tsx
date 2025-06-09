'use client';

import { useState } from 'react';
import { MessageSquare, X, Sparkles, Send } from 'lucide-react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card } from '@/ui/card';
import { Avatar } from '@/ui/avatar'; 

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AutomationAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuggestion?: (suggestion: any) => void;
  workflowName?: string;
}

export default function AutomationAssistant({
  open, 
  onOpenChange,
  onSuggestion,
  workflowName = 'New Workflow'
}: AutomationAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I noticed you're creating a new workflow called "${workflowName}". How can I help you build this automation?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'I can help with that! Would you like me to suggest some nodes for your workflow?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  
  if (!open) return null;
  
  return (
    <div className="fixed right-0 top-16 bottom-0 bg-white shadow-lg border-l w-[350px] flex flex-col z-10">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="font-medium text-base">Automation Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <div 
            key={i} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
          >
            <div className="flex gap-2 max-w-[80%]">
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 bg-purple-100 text-purple-800">
                  <span>VI</span>
                </Avatar>
              )}
              
              <div 
                className={`rounded-xl p-3 ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 bg-blue-100 text-blue-800">
                  <span>GS</span>
                </Avatar>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask the assistant..." 
            className="flex-grow"
          />
          <Button type="submit" variant="ghost" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <div className="text-sm font-medium mb-2">Quick Suggestions</div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="text-xs h-auto py-1 justify-start"
            onClick={() => {
              setInput("How do I connect data sources?");
            }}
          >
            Connect data
          </Button>
          <Button 
            variant="outline" 
            className="text-xs h-auto py-1 justify-start"
            onClick={() => {
              setInput("What are good decision nodes?");
            }}
          >
            Decision nodes
          </Button>
        </div>
      </div>
    </div>
  );
}
