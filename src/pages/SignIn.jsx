import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/app');
        }
    }, [navigate]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await loginUser(email, password);
            navigate('/app');
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900 border border-white/10 p-10 rounded-[40px] shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center text-slate-950 font-bold text-2xl shadow-lg mx-auto mb-6">
                        Q
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Welcome Back</h2>
                    <p className="text-slate-500 font-medium">Continue your smart note-taking journey</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-600"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-black py-4 rounded-2xl text-lg shadow-xl shadow-teal-500/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                Sign In
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 font-medium">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-teal-400 font-bold hover:underline">Create one free</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;
