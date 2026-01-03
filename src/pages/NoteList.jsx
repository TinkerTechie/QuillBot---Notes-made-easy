import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Trash2, Calendar, ChevronRight } from 'lucide-react';
import { getNotes, deleteNote } from '../api';
import { motion } from 'framer-motion';

function NoteList() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const data = await getNotes();
            setNotes(data);
        } catch (err) {
            console.error("Failed to fetch notes", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await deleteNote(id);
                fetchNotes(); // Refresh list
            } catch (err) {
                alert("Failed to delete note");
            }
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-lg">Q</div>
                        <span>My Notes</span>
                    </div>

                    <button
                        onClick={() => navigate('/note/new')}
                        className="btn-primary flex items-center gap-2 text-sm"
                    >
                        <Plus size={18} />
                        New Note
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search your notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white shadow-sm"
                    />
                </div>

                {/* Notes Grid */}
                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading notes...</div>
                ) : filteredNotes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No notes found</h3>
                        <p className="text-slate-500 mb-6">Create your first note to get started.</p>
                        <button onClick={() => navigate('/note/new')} className="btn-secondary">Create Note</button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNotes.map((note) => (
                            <motion.div
                                key={note._id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => navigate(`/note/${note._id}`)}
                                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all cursor-pointer group flex flex-col h-48"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-slate-800 line-clamp-1 text-lg group-hover:text-brand-600 transition-colors">
                                        {note.title || 'Untitled Note'}
                                    </h3>
                                    <button
                                        onClick={(e) => handleDelete(e, note._id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                                    {note.content || 'No content...'}
                                </p>

                                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 mt-auto">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(note.updatedAt).toLocaleDateString()}
                                    </span>
                                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-500" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NoteList;
