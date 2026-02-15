'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User, ArrowUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const [suggestions, setSuggestions] = useState<{ id: string; question: string }[]>([]);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollPosition / documentHeight) * 100;

            // Show chatbot only after 10% scroll and hide when in bottom 20%
            setShowChatbot(scrollPercentage > 10 && scrollPercentage < 80);

            // Show scroll to top button when in bottom 20%
            setShowScrollTop(scrollPercentage >= 80);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Scroll to bottom when messages or suggestions change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, suggestions]);


    const fetchSuggestions = async () => {
        try {
            const currentPanel = getCurrentPanel();
            const response = await fetch(`/api/chatbot/suggestions?panel=${currentPanel}`);
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.suggestions || []);
            }
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
        }
    };

    // Add welcome message and fetch suggestions when chat opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    text: 'Hello! 👋 I\'m your Swasthify assistant. How can I help you today?',
                    sender: 'bot',
                    timestamp: new Date(),
                },
            ]);
            fetchSuggestions();
        }
    }, [isOpen, messages.length]);

    // Detect current panel from pathname
    const getCurrentPanel = (): string => {
        if (pathname.includes('doctor-panel')) return 'doctor';
        if (pathname.includes('lab-panel')) return 'lab';
        if (pathname.includes('superAdmin')) return 'admin';
        return 'general';
    };

    const handleSuggestionClick = (question: string) => {
        setInputValue(question);
        // Optional: Auto-send or just populate
        // Let's auto-send for better UX
        handleSendMessage(question);
    };

    const handleSendMessage = async (textOverride?: string) => {
        const textToSend = textOverride || inputValue;
        if (!textToSend.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setSuggestions([]); // Clear suggestions while loading
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: textToSend,
                    context: {
                        panel: getCurrentPanel(),
                        pathname,
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);

            // Set dynamic suggestions from Gemini response if available
            if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
                const newSuggestions = data.suggestions.map((q: string, i: number) => ({
                    id: `sugg-${Date.now()}-${i}`,
                    question: q
                }));
                setSuggestions(newSuggestions);
            } else {
                // Fallback to static suggestions if none returned
                fetchSuggestions();
            }

        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error. Please try again or contact support if the issue persists.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
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
        <>

            {/* "How can I help you?" Tooltip */}
            <AnimatePresence>
                {showChatbot && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="fixed bottom-5 right-20 md:bottom-6 md:right-24 lg:bottom-8 lg:right-24 z-50 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2 pointer-events-none"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            How can I help you?
                        </p>
                        {/* Arrow */}
                        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 border-r border-t border-gray-100 dark:border-gray-700"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Bubble Button */}
            <AnimatePresence>
                {showChatbot && (
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-4 right-4 md:bottom-5 md:right-5 lg:bottom-6 lg:right-6 z-50 flex h-12 w-12 md:h-13 md:w-13 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle chatbot"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="h-6 w-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="open"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MessageCircle className="h-6 w-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && showChatbot && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 100, x: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 100, x: 50 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1] // Apple-like smooth ease
                        }}
                        style={{ transformOrigin: 'bottom right' }}
                        className="fixed bottom-16 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-20 md:right-4 lg:bottom-24 lg:right-24 z-50 flex h-[70vh] md:h-[550px] lg:h-[500px] w-[90%] md:w-[400px] lg:w-[380px] flex-col rounded-xl md:rounded-xl lg:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2.5 md:px-3.5 md:py-2.5 lg:px-4 lg:py-3 text-white">
                            <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4 md:h-5 md:w-5" />
                                <div>
                                    <h3 className="font-semibold text-xs md:text-sm">Swasthify Assistant</h3>
                                    <p className="text-[10px] md:text-xs opacity-90">Always here to help</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 hover:bg-white/20 transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-2 md:p-3 lg:p-4 space-y-2 md:space-y-3 lg:space-y-4 bg-gray-50 dark:bg-gray-950">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    {message.sender === 'bot' && (
                                        <div className="flex-shrink-0 h-7 w-7 md:h-7.5 md:w-7.5 lg:h-8 lg:w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                            <Bot className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] md:max-w-[75%] rounded-2xl px-3 py-2 md:px-4 md:py-2 ${message.sender === 'user'
                                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <p className="text-xs md:text-sm whitespace-pre-wrap">{message.text}</p>
                                        <p
                                            className={`text-[10px] md:text-xs mt-1 ${message.sender === 'user'
                                                ? 'text-white/70'
                                                : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                        >
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                    {message.sender === 'user' && (
                                        <div className="flex-shrink-0 h-7 w-7 md:h-7.5 md:w-7.5 lg:h-8 lg:w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
                                            <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-2 justify-start"
                                >
                                    <div className="flex-shrink-0 h-7 w-7 md:h-7.5 md:w-7.5 lg:h-8 lg:w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                        <Bot className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-3 py-2 md:px-4 md:py-3">
                                        <div className="flex gap-1">
                                            <motion.div
                                                className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-gray-400"
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                            />
                                            <motion.div
                                                className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-gray-400"
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                            />
                                            <motion.div
                                                className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-gray-400"
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Suggestions */}
                            <AnimatePresence>
                                {!isLoading && suggestions.length > 0 && (
                                    <motion.div
                                        className="flex flex-col gap-2 mt-2 px-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 ml-1">Suggested questions:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((suggestion, index) => (
                                                <motion.button
                                                    key={suggestion.id}
                                                    onClick={() => handleSuggestionClick(suggestion.question)}
                                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{
                                                        duration: 0.2,
                                                        delay: index * 0.1,
                                                        type: "spring",
                                                        stiffness: 200
                                                    }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm text-left"
                                                >
                                                    {suggestion.question}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 md:p-3 lg:p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="flex-1 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 md:p-2 text-white hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Send message"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4 md:h-5 md:w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        onClick={scrollToTop}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="fixed bottom-4 right-4 md:bottom-5 md:right-5 lg:bottom-6 lg:right-6 z-50 flex h-12 w-12 md:h-13 md:w-13 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
