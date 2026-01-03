import React, { useState, useRef, useEffect } from 'react';
import { Copy, RefreshCw, Wand2, ChevronDown, Check, Loader2, History as HistoryIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { processText, getHistory } from '../api';

const MODES = [
  { id: 'paraphrase', label: 'Paraphrase', icon: '✨' },
  { id: 'summarize', label: 'Summarize', icon: '📝' },
  { id: 'formal', label: 'Formal', icon: '👔' },
  { id: 'simple', label: 'Simple', icon: '👶' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
  { id: 'expand', label: 'Expand', icon: '➕' },
  { id: 'shorten', label: 'Shorten', icon: '➖' },
  { id: 'continue', label: 'Continue Writing', icon: '➡️' },
];

function Editor() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState(MODES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // History State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  // Fetch history when sidebar opens
  useEffect(() => {
    if (historyOpen) {
      loadHistory();
    }
  }, [historyOpen]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleProcess = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await processText(inputText, mode.id);
      if (data.success) {
        setOutputText(data.result);
        // Refresh history if open
        if (historyOpen) loadHistory();
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Restore history item
  const restoreHistory = (item) => {
    setInputText(item.originalText);
    setOutputText(item.processedText);
    const foundMode = MODES.find(m => m.id === item.mode);
    if (foundMode) setMode(foundMode);
    setHistoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-50 pb-20 relative overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              Q
            </div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">AI Writer</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              <HistoryIcon size={18} />
              <span className="hidden sm:inline">History</span>
            </button>
            <div className="text-sm font-medium text-slate-500 hidden sm:block">
              GPT-3.5
            </div>
          </div>
        </div>
      </header>

      {/* History Sidebar */}
      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto border-l border-slate-200"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <HistoryIcon size={20} className="text-brand-600" /> History
                </h2>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {loadingHistory ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-brand-500" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <HistoryIcon size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No history yet.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => restoreHistory(item)}
                      className="group p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer bg-slate-50 hover:bg-white"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                          {item.mode}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm line-clamp-2 font-medium mb-1">
                        {item.originalText}
                      </p>
                      <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                        <Wand2 size={12} />
                        <span className="truncate max-w-[200px]">{item.processedText}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Your personal writing assistant.
          </h2>
          <p className="text-slate-500 text-lg">
            Paraphrase, summarize, or rewrite your text in seconds.
          </p>
        </div>

        {/* Main Editor Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">

          {/* Input Section */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Input</span>
              <span className="text-xs text-slate-400">{inputText.length} chars</span>
            </div>

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full flex-1 resize-none outline-none text-slate-700 text-lg leading-relaxed bg-transparent placeholder:text-slate-300 min-h-[300px]"
            />

            <div className="mt-4 flex items-center justify-between">
              {/* Mode Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  <span>{mode.icon}</span>
                  <span>{mode.label}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 overflow-hidden"
                    >
                      {MODES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setMode(m);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors ${mode.id === m.id ? 'text-brand-600 bg-brand-50 font-medium' : 'text-slate-600'}`}
                        >
                          <span>{m.icon}</span>
                          {m.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleProcess}
                disabled={loading || !inputText.trim()}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                {loading ? 'Processing...' : 'Paraphrase'}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex-1 bg-slate-50/50 flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Output</span>
              {outputText && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            <div className="flex-1 relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Loader2 size={32} className="animate-spin text-brand-500" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              ) : outputText ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-slate max-w-none text-lg text-slate-800 leading-relaxed"
                >
                  {outputText}
                </motion.div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-center px-8">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw size={32} className="opacity-50" />
                    <p>Your result will appear here</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100 text-sm font-medium">
                    {error}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Editor;
