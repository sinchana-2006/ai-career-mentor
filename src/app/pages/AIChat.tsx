import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, Sparkles, TrendingUp, BookOpen, Target, Briefcase,
  Volume2, VolumeX, Globe, ChevronDown, Loader2, MicOff
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  translatedContent?: string;
};

// ─── Language Config ──────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en',    label: 'English',    ttsCode: 'en-IN', flag: '🇬🇧' },
  { code: 'hi',    label: 'हिंदी',       ttsCode: 'hi-IN', flag: '🇮🇳' },
  { code: 'kn',    label: 'ಕನ್ನಡ',      ttsCode: 'kn-IN', flag: '🇮🇳' },
  { code: 'ta',    label: 'தமிழ்',       ttsCode: 'ta-IN', flag: '🇮🇳' },
  { code: 'te',    label: 'తెలుగు',     ttsCode: 'te-IN', flag: '🇮🇳' },
  { code: 'bn',    label: 'বাংলা',       ttsCode: 'bn-IN', flag: '🇮🇳' },
  { code: 'mr',    label: 'मराठी',       ttsCode: 'mr-IN', flag: '🇮🇳' },
  { code: 'gu',    label: 'ગુજરાતી',    ttsCode: 'gu-IN', flag: '🇮🇳' },
  { code: 'fr',    label: 'Français',   ttsCode: 'fr-FR', flag: '🇫🇷' },
  { code: 'es',    label: 'Español',    ttsCode: 'es-ES', flag: '🇪🇸' },
  { code: 'de',    label: 'Deutsch',    ttsCode: 'de-DE', flag: '🇩🇪' },
];

// ─── Suggestion Chips ─────────────────────────────────────────────────────────

const suggestionChips = [
  { text: 'How can I improve my readiness score?', icon: TrendingUp },
  { text: 'What should I focus on this week?',     icon: Target },
  { text: 'Best practices for React development',  icon: BookOpen },
  { text: 'Career paths in software engineering',  icon: Briefcase },
];

// ─── Initial Messages ─────────────────────────────────────────────────────────

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content:
      "Hello! I'm your AI Career Mentor — LakshyaSetu AI. I'm here to provide personalised guidance on your career journey, help you make informed decisions, and answer any questions about your learning path or skill development. How can I help you today?",
    timestamp: new Date(),
  },
];

// ─── Translation Helper (Google Translate free endpoint) ─────────────────────
// NOTE: Replace with a proper Google Translate API key in production.
// For now this uses the unofficial endpoint which is fine for demos.
async function translateText(text: string, targetLang: string): Promise<string> {
  if (targetLang === 'en') return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map((chunk: any[]) => chunk[0]).join('');
  } catch {
    return text; // fallback to original on error
  }
}

// ─── Gemini API Call ──────────────────────────────────────────────────────────
// Replace YOUR_GEMINI_API_KEY with your actual key from https://aistudio.google.com
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

const SYSTEM_PROMPT = `You are LakshyaSetu AI, a warm, knowledgeable AI career mentor for students and early-career professionals in India. 
You give concise, actionable, personalised career advice. You are friendly, encouraging, and practical.
Keep responses under 200 words unless a detailed breakdown is truly needed. Use emojis sparingly for clarity.`;

async function callGemini(userMessage: string, history: Message[]): Promise<string> {
  const conversationHistory = history.slice(-10).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      ...conversationHistory,
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: { maxOutputTokens: 512, temperature: 0.75 },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not generate a response.';
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIChat() {
  const [messages, setMessages]               = useState<Message[]>(initialMessages);
  const [input, setInput]                     = useState('');
  const [isTyping, setIsTyping]               = useState(false);
  const [selectedLang, setSelectedLang]       = useState(LANGUAGES[0]);
  const [langMenuOpen, setLangMenuOpen]       = useState(false);
  const [speakingId, setSpeakingId]           = useState<number | null>(null);
  const [translatingIds, setTranslatingIds]   = useState<Set<number>>(new Set());
  const [ttsSupported]                        = useState(() => 'speechSynthesis' in window);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const langMenuRef    = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Close lang menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Language change: re-translate all assistant messages ──────────────────
  const handleLanguageChange = useCallback(async (lang: typeof LANGUAGES[0]) => {
    setSelectedLang(lang);
    setLangMenuOpen(false);
    window.speechSynthesis.cancel();
    setSpeakingId(null);

    if (lang.code === 'en') {
      setMessages(prev => prev.map(m => ({ ...m, translatedContent: undefined })));
      return;
    }

    const assistantIds = messages.filter(m => m.role === 'assistant').map(m => m.id);
    setTranslatingIds(new Set(assistantIds));

    const updated = await Promise.all(
      messages.map(async (m) => {
        if (m.role !== 'assistant') return m;
        const translated = await translateText(m.content, lang.code);
        return { ...m, translatedContent: translated };
      })
    );
    setMessages(updated);
    setTranslatingIds(new Set());
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await callGemini(textToSend, messages);

      let translatedContent: string | undefined;
      if (selectedLang.code !== 'en') {
        translatedContent = await translateText(responseText, selectedLang.code);
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseText,
        translatedContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '⚠️ I had trouble connecting. Please check your API key in `.env` (VITE_GEMINI_API_KEY) and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── Text-to-Speech ────────────────────────────────────────────────────────
  const handleSpeak = (message: Message) => {
    if (!ttsSupported) return;

    if (speakingId === message.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = message.translatedContent || message.content;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedLang.ttsCode;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(message.id);
    window.speechSynthesis.speak(utterance);
  };

  const displayText = (msg: Message) =>
    (selectedLang.code !== 'en' && msg.translatedContent) ? msg.translatedContent : msg.content;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col p-4 md:p-8 bg-background">

      {/* ── Header ── */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-violet-500 to-chart-3 flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">AI Career Mentor</h1>
            <p className="text-xs text-muted-foreground">LakshyaSetu — Your personal career intelligence</p>
          </div>
        </div>

        {/* ── Language Selector ── */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen(o => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-secondary/60 transition-all text-sm text-foreground"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span>{selectedLang.flag} {selectedLang.label}</span>
            <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {langMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border bg-card shadow-xl shadow-black/10 z-50 overflow-hidden"
              >
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary/70 transition-colors ${
                      selectedLang.code === lang.code ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Chat Container ── */}
      <div className="flex-1 rounded-2xl bg-card border border-border overflow-hidden flex flex-col shadow-sm">

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] md:max-w-2xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                    message.role === 'user'
                      ? 'bg-primary shadow-md shadow-primary/30'
                      : 'bg-gradient-to-br from-primary via-violet-500 to-chart-3 shadow-md shadow-primary/20'
                  }`}>
                    {message.role === 'user'
                      ? <span className="text-xs text-primary-foreground font-semibold">U</span>
                      : <Sparkles className="w-4 h-4 text-white" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className="flex flex-col gap-1">
                    <div className={`rounded-2xl px-4 py-3 leading-relaxed text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-secondary/40 text-foreground border border-border/60 rounded-tl-sm'
                    }`}>
                      {translatingIds.has(message.id)
                        ? <span className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-3 h-3 animate-spin" /> Translating…
                          </span>
                        : <p className="whitespace-pre-wrap">{displayText(message)}</p>
                      }
                    </div>

                    {/* Meta row */}
                    <div className={`flex items-center gap-2 px-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[11px] text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {/* TTS button — only for assistant */}
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => handleSpeak(message)}
                          title={speakingId === message.id ? 'Stop speaking' : 'Read aloud'}
                          disabled={!ttsSupported || translatingIds.has(message.id)}
                          className={`p-1 rounded-md transition-all ${
                            speakingId === message.id
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          {!ttsSupported
                            ? <MicOff className="w-3.5 h-3.5" />
                            : speakingId === message.id
                              ? <VolumeX className="w-3.5 h-3.5" />
                              : <Volume2 className="w-3.5 h-3.5" />
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-2xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-violet-500 to-chart-3 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-secondary/40 border border-border/60 flex items-center gap-1">
                    {[0, 150, 300].map(delay => (
                      <div
                        key={delay}
                        className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* ── Suggestion Chips ── */}
        {messages.length === 1 && (
          <div className="px-4 md:px-6 pb-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3 mt-4 font-medium uppercase tracking-wide">Suggested topics</p>
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  onClick={() => handleSend(chip.text)}
                  className="px-3 py-2 rounded-xl bg-secondary/40 border border-border/60 text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  <chip.icon className="w-3.5 h-3.5 text-primary" />
                  {chip.text}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input Area ── */}
        <div className="p-4 md:p-6 border-t border-border bg-card/80">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your career…"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center gap-2 text-sm font-medium"
            >
              {isTyping
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
              <span className="hidden sm:inline">{isTyping ? 'Thinking…' : 'Send'}</span>
            </button>
          </form>
          <p className="text-[11px] text-muted-foreground mt-2.5 text-center">
            AI responses are for guidance only. Always verify important career decisions with professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
