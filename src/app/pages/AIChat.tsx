import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, TrendingUp, BookOpen, Target, Briefcase } from 'lucide-react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content: "Hello! I'm your AI Career Mentor. I'm here to provide personalized guidance on your career journey, help you make informed decisions, and answer any questions about your learning path, skill development, or career transitions. How can I assist you today?",
    timestamp: new Date(),
  },
];

const suggestionChips = [
  { text: 'How can I improve my readiness score?', icon: TrendingUp },
  { text: 'What should I focus on this week?', icon: Target },
  { text: 'Best practices for React development', icon: BookOpen },
  { text: 'Career paths in software engineering', icon: Briefcase },
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: getAIResponse(textToSend),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('readiness') || input.includes('score')) {
      return "Your current readiness score of 78% is quite strong! To boost it further, I recommend:\n\n1. Complete the 'TypeScript Advanced' course (currently 45% done) - this will add 8 points to your technical skills\n2. Practice 5 more System Design questions - these are frequently asked in senior roles\n3. Work on a portfolio project that demonstrates your full-stack capabilities\n\nFocusing on these areas over the next 2-3 weeks could push your score to 85%+, making you highly competitive for your target roles.";
    }
    
    if (input.includes('focus') || input.includes('this week')) {
      return "Based on your current progress and upcoming milestones, here's what I recommend focusing on this week:\n\n📚 Learning Priority:\n- Complete 'TypeScript Advanced' course (3 hours remaining)\n- Start 'React State Management' course\n\n💡 Skill Development:\n- Practice 2-3 System Design problems\n- Review your weak areas in testing\n\n🎯 Career Actions:\n- Update your LinkedIn with your new TypeScript skills\n- Apply to 3-5 Frontend Developer positions that match your 92% score\n\nThis balanced approach will help you maintain momentum while building market-ready skills.";
    }
    
    if (input.includes('react')) {
      return "Here are some best practices for React development that align with current industry standards:\n\n1. **Component Architecture**: Use functional components with hooks. Keep components small and focused on a single responsibility.\n\n2. **State Management**: Start with useState/useContext for simple apps. Consider Redux Toolkit or Zustand for complex state.\n\n3. **Performance**: Use React.memo, useMemo, and useCallback strategically. Don't over-optimize early.\n\n4. **Code Organization**: Group by feature, not by type. Keep related components, hooks, and utilities together.\n\n5. **TypeScript**: Use it! It catches bugs early and improves developer experience.\n\nWould you like me to elaborate on any of these points?";
    }
    
    if (input.includes('career path')) {
      return "Software engineering offers diverse career paths! Based on your profile, here are the most promising options:\n\n🎯 **Frontend Specialist** (92% match)\nAverage Salary: $95k-130k\nGrow into: Senior Frontend → Staff Engineer → Engineering Manager\n\n🚀 **Full Stack Engineer** (87% match)\nAverage Salary: $105k-150k\nGrow into: Senior Full Stack → Technical Lead → Solutions Architect\n\n🎨 **UI/UX Engineer** (81% match)\nAverage Salary: $90k-125k\nGrow into: Senior UI Engineer → Design Systems Lead → Principal Designer\n\nYour current skills align best with Frontend and Full Stack roles. Would you like a detailed roadmap for any specific path?";
    }
    
    return "That's a great question! I'm here to help you with personalized career guidance. I can assist you with:\n\n• Skill development strategies and learning priorities\n• Career path recommendations based on your profile\n• Interview preparation tips and best practices\n• Resume and portfolio optimization\n• Salary negotiation guidance\n• Work-life balance in tech\n\nFeel free to ask me anything specific about your career journey!";
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="h-screen flex flex-col p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">AI Career Mentor</h1>
            <p className="text-sm text-muted-foreground">Your personal career intelligence assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 rounded-xl bg-card border border-border backdrop-blur-xl overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-primary' 
                    : 'bg-gradient-to-br from-primary to-chart-3'
                }`}>
                  {message.role === 'user' ? (
                    <span className="text-sm text-primary-foreground font-medium">A</span>
                  ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`rounded-xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-foreground border border-border'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-3xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="rounded-xl px-4 py-3 bg-secondary/50 border border-border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="px-6 pb-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3 mt-4">Suggested topics:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(chip.text)}
                  className="px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground hover:bg-secondary hover:border-primary/30 transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  <chip.icon className="w-4 h-4 text-primary" />
                  {chip.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-border">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your career..."
              className="flex-1 px-4 py-3 rounded-lg bg-input-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            AI responses are generated for guidance. Always verify important career decisions with professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
