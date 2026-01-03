import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Loader2, Check } from 'lucide-react';
import { createNote, getNote, updateNote, processText } from '../api';
import { motion } from 'framer-motion';

function NoteEditor() {
    const { id } = useParams(); // Note ID if editing
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);
    const [saved, setSaved] = useState(false);

    const textareaRef = useRef(null);

    useEffect(() => {
        if (id) {
            loadNote();
        }
    }, [id]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [content]);

    const loadNote = async () => {
        try {
            const note = await getNote(id);
            setTitle(note.title);
            setContent(note.content);
        } catch (err) {
            console.error("Failed to load note", err);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setSaved(false);
        try {
            if (id) {
                await updateNote(id, { title, content });
            } else {
                const newNote = await createNote({ title, content });
                navigate(`/note/${newNote._id}`, { replace: true }); // Update URL to edit mode
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Failed to save", err);
            alert('Failed to save note');
        } finally {
            setLoading(false);
        }
    };

    const handleAI = async (mode) => {
        if (!content.trim()) return;
        setAiLoading(true);
        try {
            // For now, we just process the content and append/replace. 
            // Or we can ask AI to rewrite it.
            // Ideally, specific prompts: "Summarize this", "Fix grammar", etc.

            const result = await processText(content, mode);
            if (result.success) {
                if (mode === 'summarize') {
                    setContent(content + '\n\n**Summary:**\n' + result.result);
                } else {
                    setContent(result.result); // Replace content for rewrite/paraphrase
                }
            }
        } catch (err) {
            alert('AI Error: ' + err);
        } finally {
            setAiLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>;
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">

            {/* Top Bar */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-sm text-slate-400 font-medium">
                        {id ? 'Editing Note' : 'New Note'}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 mr-2">
                        {saved ? 'Saved' : ''}
                    </span>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : <Save size={18} />}
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Untitled Note"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-4xl md:text-5xl font-bold placeholder:text-slate-300 border-none outline-none bg-transparent mb-8 text-slate-800"
                />

                {/* AI Toolbar */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => handleAI('paraphrase')}
                        disabled={aiLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-50 text-brand-700 text-sm font-medium hover:bg-brand-100 transition-colors"
                    >
                        <Sparkles size={14} /> Improve Writing
                    </button>
                    <button
                        onClick={() => handleAI('summarize')}
                        disabled={aiLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 transition-colors"
                    >
                        <Sparkles size={14} /> Summarize
                    </button>
                    {aiLoading && <Loader2 size={16} className="animate-spin text-slate-400" />}
                </div>

                {/* Note Body */}
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing..."
                    className="w-full min-h-[500px] resize-none outline-none text-lg leading-relaxed text-slate-700 placeholder:text-slate-300"
                />
            </div>

        </div>
    );
}

export default NoteEditor;
