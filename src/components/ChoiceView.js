import React from 'react';
import { Cloud, MessageSquare, ArrowRight } from 'lucide-react';

export default function ChoiceView({ onChoice }) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">What's on your mind?</h1>
                    <p className="text-xl text-slate-500 font-medium">Select an action to proceed</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 px-4">
                    <button onClick={() => onChoice('upload')} className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-100/50 hover:border-blue-100 transition-all text-left">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                            <Cloud className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Upload Documents</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed font-medium">Add new PDF, DOCX, or TXT files to your knowledge base.</p>
                        <span className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold group-hover:bg-slate-700 transition-all">
                            Go to Upload <ArrowRight className="w-4 h-4 ml-2" />
                        </span>
                    </button>

                    <button onClick={() => onChoice('dashboard')} className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-amber-100/50 hover:border-amber-100 transition-all text-left">
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                            <MessageSquare className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Chat with AI</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed font-medium">Ask questions and extract insights from your files.</p>
                        <span className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold group-hover:bg-amber-600 transition-all">
                            Start Chatting <ArrowRight className="w-4 h-4 ml-2" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
