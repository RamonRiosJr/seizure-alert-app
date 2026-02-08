import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { X, Send, Mic, Sparkles, User, Flag, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { messages, input, setInput, sendMessage, isLoading, error, clearChat } = useChat(language);
  const { transcript, isListening, startListening, hasRecognitionSupport } = useSpeechRecognition();
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [apiKey] = useLocalStorage<string>('gemini_api_key', '');
  const { t } = useTranslation();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, error]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
        setShowPriorityOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input, priority);
      setShowPriorityOptions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const micButtonTooltip = isListening ? t('chatMicListening') : hasRecognitionSupport ? 'Use microphone' : t('chatMicError');
  const isApiKeyMissing = !apiKey;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg h-[90vh] max-h-[700px] flex flex-col transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('chatTitle')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm(t('chatClearConfirm') || 'Clear chat history?')) {
                  clearChat();
                }
              }}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Clear Chat History"
              title="Clear Chat History"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center"><Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>}

              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : `rounded-bl-none ${error && index === messages.length - 1 ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`
                  }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {msg.role === 'user' &&
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center relative">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  {msg.priority && (
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-700 rounded-full p-0.5 shadow">
                      <Flag className={`w-4 h-4 ${msg.priority === 'high' ? 'text-red-500' : msg.priority === 'medium' ? 'text-yellow-500' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>
              }
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center"><Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
              <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-200">
                <div className="flex items-center justify-center space-x-1 h-5">
                  <span className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
          {isApiKeyMissing ? (
            <div className="text-center text-gray-500 dark:text-gray-400 p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800">
              {t('chatAPIKeyMissing')}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div ref={priorityRef} className="relative">
                <button
                  onClick={() => setShowPriorityOptions(prev => !prev)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                  aria-label="Set message priority"
                >
                  <Flag className={`w-6 h-6 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : 'text-gray-400'}`} />
                </button>
                {showPriorityOptions && (
                  <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 w-36 z-10">
                    {(['high', 'medium', 'low'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPriority(p);
                          setShowPriorityOptions(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${priority === p ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        <Flag className={`w-4 h-4 ${p === 'high' ? 'text-red-500' : p === 'medium' ? 'text-yellow-500' : 'text-gray-400'}`} />
                        <span className="capitalize">{p} Priority</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatPlaceholder')}
                className="flex-grow min-w-0 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                disabled={isLoading || isListening}
              />
              {hasRecognitionSupport && (
                <button
                  onClick={startListening}
                  className={`p-2 rounded-full transition-colors relative group ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'}`}
                  disabled={isLoading}
                  aria-label={micButtonTooltip}
                >
                  <Mic className="w-6 h-6" />
                  <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap dark:bg-black">{micButtonTooltip}</span>
                </button>
              )}
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Chatbot;