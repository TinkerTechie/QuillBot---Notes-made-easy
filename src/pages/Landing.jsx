import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles, Edit3, Zap, Layers, FileText, CheckCircle,
    Terminal, BookOpen, Palette, ArrowRight, ShieldCheck,
    MousePointer2, MessageSquare, Plus, Search, HelpCircle,
    Brain, ListChecks, Link as LinkIcon, GraduationCap,
    Clock, Sun, Moon, ArrowDown, ChevronRight, Share2,
    Cpu, Workflow, Globe, Command, Calculator, Notebook
} from 'lucide-react';
import { motion } from 'framer-motion';

function Landing() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300 selection:bg-teal-500/30 selection:text-teal-200 overflow-x-hidden">

            {/* Background Decor */}
            <div className="fixed inset-0 -z-10 bg-[#0f172a]"></div>
            <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] -z-10 pointer-events-none"></div>

            {/* Navbar */}
            <nav className="border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-[100]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-slate-900 font-bold text-2xl shadow-lg shadow-teal-500/20">
                            Q
                        </div>
                        <span className="font-extrabold text-2xl tracking-tighter text-white">QuillBot</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#workflow" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">How it works</a>
                        <a href="#use-cases" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Solutions</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {userInfo ? (
                            <div className="flex items-center gap-6">
                                <div className="hidden sm:flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/app')}>
                                    <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold border border-teal-500/20">
                                        {userInfo.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{userInfo.name}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/app')}
                                    className="bg-teal-500 text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-teal-500/10 hover:bg-teal-400 transition-all active:scale-95"
                                >
                                    Open Workspace
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/signin')}
                                    className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="bg-teal-500 text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-teal-500/10 hover:bg-teal-400 transition-all active:scale-95"
                                >
                                    Get Started Free
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border border-teal-500/20"
                    >
                        <Sparkles size={14} /> AI-powered notebook for your daily notes
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-[1.1]"
                    >
                        Turn rough ideas into <br />
                        <span className="text-teal-400">clean notes.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        QuillBot helps you capture messy ideas fast and uses AI to organize them into clear notes, tasks, and summaries instantly.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        {userInfo ? (
                            <button
                                onClick={() => navigate('/app')}
                                className="w-full sm:w-auto px-12 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-2xl text-lg transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2"
                            >
                                <Notebook size={20} />
                                Open Your Workspace
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-2xl text-lg transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2"
                                >
                                    <Plus size={20} />
                                    Create new account
                                </button>
                                <button
                                    onClick={() => navigate('/signin')}
                                    className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Notebook size={20} />
                                    Sign In
                                </button>
                            </>
                        )}
                    </motion.div>

                    <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">
                        Trusted by 10,000+ creators & students
                    </p>
                </div>
            </section>

            {/* What you can do section */}
            <section className="py-24 bg-slate-900/50 px-6 border-y border-white/5">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">What you can do in QuillBot</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ActionBullet icon={<Edit3 className="text-teal-400" />} text="Write and save class notes" />
                        <ActionBullet icon={<Zap className="text-amber-400" />} text="Turn long notes into 5-bullet summaries" />
                        <ActionBullet icon={<ListChecks className="text-emerald-400" />} text="Convert notes into to-do lists" />
                        <ActionBullet icon={<Sparkles className="text-purple-400" />} text="Get a 1-sentence revision brief" />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">More than a basic notes app</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">QuillBot adds an intelligence layer to your writing workspace.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={<Brain />}
                            title="Smart capture"
                            desc="Quickly capture rough notes or long-form thoughts; AI cleans and structures them later."
                        />
                        <FeatureCard
                            icon={<LinkIcon />}
                            title="Auto-link notes"
                            desc="Our AI detects related topics and projects, linking your ideas together automatically."
                        />
                        <FeatureCard
                            icon={<MousePointer2 />}
                            title="Distraction-free UI"
                            desc="A clean, focused writing environment that stay out of your way until you need the AI."
                        />
                        <FeatureCard
                            icon={<Globe />}
                            title="Sync all devices"
                            desc="Access your second brain from your laptop, tablet, or phone. Always in sync."
                        />
                    </div>
                </div>
            </section>

            {/* Built for your day section */}
            <section className="py-32 bg-slate-900/50 px-6 border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Built for your day</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <WorkflowBox
                            time="MORNING"
                            title="Capture lectures"
                            desc="Input rough points from stand-up meetings or college lectures onto the blank canvas."
                        />
                        <WorkflowBox
                            time="AFTERNOON"
                            title="Clean & Summarize"
                            desc="Use the AI Action Bar on your notes to clear the fluff and extract key bullet points."
                        />
                        <WorkflowBox
                            time="NIGHT"
                            title="Quick Review"
                            desc="Check your nightly revision brief to see what you need to recall or continue tomorrow."
                        />
                    </div>
                </div>
            </section>

            {/* Process Section (How it works) */}
            <section id="workflow" className="py-32 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">How it works</h2>
                    </div>

                    <div className="space-y-24">
                        <ProcessItem
                            num="01"
                            title="Capture your notes"
                            desc="Type, paste lecture notes, or drop files. Don't worry about formatting; just get your ideas down on the page."
                            color="teal"
                        />
                        <ProcessItem
                            num="02"
                            title="AI organizes everything"
                            desc="We detect topics, deadlines, and references in your text and link them to your existing collection of project notes."
                            color="indigo"
                        />
                        <ProcessItem
                            num="03"
                            title="Review and revise easily"
                            desc="Get a clean 5-bullet summary, a generated task list, and a 1-sentence revision brief to keep your momentum going."
                            color="purple"
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 bg-[#0f172a] text-center px-6">
                <div className="max-w-3xl mx-auto bg-slate-900 border border-white/10 p-12 md:p-20 rounded-[40px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready for better notes?</h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium mb-12">Join thousands of students and developers who use QuillBot to organize their life.</p>

                    <button
                        onClick={() => navigate(userInfo ? '/app' : '/signup')}
                        className="w-full sm:w-auto px-12 py-5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-2xl text-xl transition-all shadow-xl shadow-teal-500/10"
                    >
                        {userInfo ? 'Go to your notes' : 'Get started free'}
                    </button>

                    <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">No credit card</div>
                        <div className="flex items-center gap-2">Save unlimited notes</div>
                        <div className="flex items-center gap-2">AI summaries included</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-500/10 text-teal-400 rounded-lg flex items-center justify-center font-bold">Q</div>
                        <span className="font-extrabold text-lg text-white">QuillBot · The AI note workspace</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
                        <a href="#" className="hover:text-teal-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-teal-400 transition-colors">Terms</a>
                    </div>

                    <p className="text-slate-600 text-xs font-medium uppercase tracking-widest">
                        © 2026 QUILLBOT INC.
                    </p>
                </div>
            </footer>

        </div>
    );
}

// Sub-components
function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            <button className="mt-6 text-xs font-bold text-teal-500/70 hover:text-teal-400 uppercase tracking-widest flex items-center gap-2 transition-colors">
                See how it works <ChevronRight size={14} />
            </button>
        </div>
    );
}

function WorkflowBox({ time, title, desc }) {
    return (
        <div className="text-left">
            <span className="text-[10px] font-black text-teal-500/60 uppercase tracking-widest mb-4 block">{time}</span>
            <h3 className="text-2xl font-bold text-white mb-4 leading-none uppercase">{title}</h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">{desc}</p>
        </div>
    );
}

function ProcessItem({ num, title, desc, color }) {
    const colors = {
        teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${colors[color]} border flex-shrink-0`}>
                {num}
            </div>
            <div className="max-w-2xl text-left">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tighter">{title}</h3>
                <p className="text-lg md:text-xl text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function ActionBullet({ icon, text }) {
    return (
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4 hover:border-white/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <p className="text-white font-bold text-sm leading-tight">{text}</p>
        </div>
    );
}

export default Landing;
