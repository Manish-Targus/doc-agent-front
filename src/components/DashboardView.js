"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutGrid, Bell, Search, FileText, CheckCircle2, X, Trash2, Upload,
    Eye, EyeOff, Bot, User, Quote, BookOpen, Send
} from 'lucide-react';
import { api, API_BASE_URL } from '../utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function DashboardView({ collections, setCollections, activeCollectionId, setActiveCollectionId, onLogout, onNavigateToUpload }) {
    const [chatHistory, setChatHistory] = useState([]);
    const [inputQuery, setInputQuery] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [histories, setHistories] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showDocument, setShowDocument] = useState(false);
    const [highlightedText, setHighlightedText] = useState(null);
    const [docContent, setDocContent] = useState("");

    // Upload Modal State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadCollectionName, setUploadCollectionName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const chatContainerRef = useRef(null);

    const activeCollection = collections.find((c) => c.id === activeCollectionId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isGenerating]);

    useEffect(() => {
        if (activeCollectionId && activeCollection) {
            setDocContent("Document content preview not available via API yet.");
        }
    }, [activeCollectionId, activeCollection]);

    const handleCollectionSwitch = (newId) => {
        if (activeCollectionId === newId) return;

        // Save current history
        if (activeCollectionId) {
            setHistories(prev => ({ ...prev, [activeCollectionId]: chatHistory }));
        }

        setActiveCollectionId(newId);

        // Load new history
        setChatHistory(histories[newId] || []);
    };

    const handleSourceClick = (textToHighlight) => {
        setHighlightedText(textToHighlight);
        setShowDocument(true);
    };

    const renderDocContent = (content, highlight) => {
        if (!highlight) return <div className="whitespace-pre-wrap">{content}</div>;
        const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexPattern = `(${escapedHighlight.replace(/\s+/g, '[\\s\\n]+')})`;
        const regex = new RegExp(regexPattern, 'gi');
        const parts = content.split(regex);

        return (
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-600">
                {parts.map((part, i) => {
                    const isMatch = new RegExp(`^${regexPattern}$`, 'gi').test(part);
                    return isMatch ? (
                        <mark key={i} className="bg-amber-200 text-slate-900 rounded px-1 py-0.5 font-bold shadow-sm border-b-2 border-amber-300">
                            {part}
                        </mark>
                    ) : (
                        <span key={i}>{part}</span>
                    );
                })}
            </div>
        );
    };

    const handleFileSelect = (e) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setUploadCollectionName(file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_"));
            setShowUploadModal(true);
            // Reset file input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleUploadSubmit = async () => {
        if (!selectedFile || !uploadCollectionName.trim()) return;

        setIsUploading(true);
        setUploadProgress(10);
        setShowUploadModal(false); // Close modal immediately to show progress in sidebar

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const result = await api.upload(selectedFile, uploadCollectionName);

            clearInterval(progressInterval);
            setUploadProgress(100);

            const newDoc = {
                id: result.id || Date.now().toString(),
                name: uploadCollectionName,
                size: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                type: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'
            };
            setCollections((prev) => [newDoc, ...prev]);

            // Save current history before switching
            if (activeCollectionId) {
                setHistories(prev => ({ ...prev, [activeCollectionId]: chatHistory }));
            }

            setActiveCollectionId(newDoc.id);
            setChatHistory([]);
        } catch (error) {
            console.error("Upload failed", error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
            setUploadCollectionName("");
        }
    };

    const confirmDelete = async (id) => {
        try {
            const collectionToDelete = collections.find(c => c.id === id);
            if (collectionToDelete) {
                await api.deleteCollection(collectionToDelete.name);
                setCollections((prev) => prev.filter((c) => c.id !== id));

                // If deleting active collection, clear history
                if (activeCollectionId === id) {
                    setActiveCollectionId(null);
                    setChatHistory([]);
                }

                // Remove from histories
                setHistories(prev => {
                    const newHistories = { ...prev };
                    delete newHistories[id];
                    return newHistories;
                });
            }
        } catch (error) {
            console.error("Delete failed", error);
            alert("Delete failed");
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    const handleSendMessage = async () => {
        if (!inputQuery.trim() || !activeCollectionId) return;
        const userMsg = inputQuery;
        setInputQuery("");

        // Add user message and empty bot message placeholder
        setChatHistory(prev => [
            ...prev,
            { role: 'user', content: userMsg },
            { role: 'bot', content: "" }
        ]);
        setIsGenerating(true);

        try {
            const historyPayload = chatHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Fetch full response first
            const result = await api.chat(userMsg, activeCollection.name, 6, "default", historyPayload);

            // Determine the answer text
            let botResponse = "No response received.";
            let sources = [];

            if (typeof result === 'string') {
                botResponse = result;
            } else if (result) {
                botResponse = result.answer || result.response || result.text || JSON.stringify(result);
                if (result.sources) sources = result.sources;
            }

            // Simulate streaming
            let currentText = "";
            const words = botResponse.split(/(\s+)/); // Split by whitespace but keep delimiters

            for (let i = 0; i < words.length; i++) {
                currentText += words[i];
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    const lastIdx = newHistory.length - 1;
                    if (newHistory[lastIdx].role === 'bot') {
                        newHistory[lastIdx] = {
                            ...newHistory[lastIdx],
                            content: currentText
                        };
                    }
                    return newHistory;
                });
                // Small delay between chunks to simulate typing
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            // Update with final sources
            setChatHistory(prev => {
                const newHistory = [...prev];
                const lastIdx = newHistory.length - 1;
                if (newHistory[lastIdx].role === 'bot') {
                    newHistory[lastIdx] = {
                        ...newHistory[lastIdx],
                        sources: sources
                    };
                }
                return newHistory;
            });

        } catch (error) {
            console.error("Chat error:", error);
            setChatHistory(prev => {
                const newHistory = [...prev];
                const lastIdx = newHistory.length - 1;
                if (newHistory[lastIdx].role === 'bot') {
                    newHistory[lastIdx].content = `Error: ${error.message}`;
                }
                return newHistory;
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateRFP = async () => {
        if (!activeCollectionId) return;
        setChatHistory(prev => [...prev, { role: 'user', content: "Generate RFP Summary" }]);
        setIsGenerating(true);

        try {
            const result = await api.generateRfpSummary(activeCollection.name);
            const summaryText = typeof result === 'string' ? result : (result.summary || JSON.stringify(result));

            setChatHistory(prev => [...prev, { role: 'bot', content: summaryText }]);
        } catch (error) {
            console.error("RFP Summary error:", error);
            setChatHistory(prev => [...prev, { role: 'bot', content: "Failed to generate summary." }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* SIDEBAR */}
            <div className="w-80 bg-white border-r border-slate-100 flex flex-col shadow-lg z-20">
                <div className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                                <LayoutGrid className="w-5 h-5 text-amber-300" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">DocuBot</h1>
                        </div>
                        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="text" placeholder="Search files..." className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-slate-200 text-slate-600 placeholder-slate-400" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-6 custom-scrollbar">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Collections</h2>
                    {collections.map((col) => (
                        <div
                            key={col.id}
                            onClick={() => handleCollectionSwitch(col.id)}
                            className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${activeCollectionId === col.id
                                ? 'bg-amber-50 border-amber-100'
                                : 'bg-transparent border-transparent hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${activeCollectionId === col.id ? 'bg-amber-200 text-slate-900' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}`}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-sm font-bold truncate ${activeCollectionId === col.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {col.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">
                                        {col.size} • {col.date}
                                    </p>
                                </div>
                            </div>
                            {showDeleteConfirm === col.id ? (
                                <div className="absolute inset-0 bg-red-50 rounded-2xl flex items-center justify-between px-4 animate-in fade-in zoom-in-95">
                                    <span className="text-xs font-bold text-red-600">Remove?</span>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); confirmDelete(col.id); }} className="p-1.5 bg-white text-red-600 rounded-lg hover:shadow-sm"><CheckCircle2 className="w-4 h-4" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(null); }} className="p-1.5 bg-white text-slate-500 rounded-lg hover:shadow-sm"><X className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(col.id); }} className="absolute right-3 top-4 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-6">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                    {isUploading ? (
                        <div className="bg-slate-50 rounded-xl p-4 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-slate-600">Uploading...</span><span className="text-xs font-bold text-blue-600">{uploadProgress}%</span></div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-slate-800 transition-all duration-200" style={{ width: `${uploadProgress}%` }} /></div>
                        </div>
                    ) : (
                        <button onClick={onNavigateToUpload} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 py-4 rounded-xl transition-all shadow-sm border border-slate-200 font-bold text-sm"><Upload className="w-4 h-4" /> Quick Upload</button>
                    )}
                </div>
            </div>

            {/* MAIN CANVAS */}
            <div className="flex-1 flex flex-col relative h-full overflow-hidden bg-[#F8F9FB]">

                {/* HEADER */}
                <div className="h-24 flex items-center justify-between px-10 z-10">
                    <div className="flex items-center gap-3">
                        {activeCollection ? (
                            <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-2.5 w-2.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                                    </span>
                                    <span className="font-bold text-slate-800">{activeCollection.name}</span>
                                </div>
                                <div className="h-4 w-[1px] bg-slate-200"></div>
                                <button
                                    onClick={() => setShowDocument(!showDocument)}
                                    className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${showDocument ? 'bg-amber-100 text-amber-800' : 'hover:bg-slate-50 text-slate-500'}`}
                                >
                                    {showDocument ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    {showDocument ? "Hide Context" : "View Context"}
                                </button>
                            </div>
                        ) : <span className="text-slate-400 font-medium italic pl-4">Choose a collection to begin...</span>}
                    </div>

                    <div className="flex items-center gap-4">
                        {activeCollection && (
                            <button onClick={handleGenerateRFP} disabled={isGenerating} className="group flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm border border-slate-200 disabled:opacity-50"><FileText className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" /> Generate Summary</button>
                        )}
                        <button onClick={onLogout} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors">Logout</button>
                    </div>
                </div>

                {/* CHAT + DOC SPLIT */}
                <div className="flex-1 flex overflow-hidden px-8 pb-8 gap-8">

                    {/* CHAT AREA */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-10 py-8 space-y-8 custom-scrollbar">
                            {chatHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner rotate-3">
                                        <Bot className="w-10 h-10 text-slate-400 -rotate-3" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">How can I help you?</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">I can analyze your documents, extract data points, and generate summaries instantly.</p>
                                </div>
                            ) : (
                                chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-6 animate-in slide-in-from-bottom-4 duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'bot' && (
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 mt-2 border border-slate-100">
                                                <Bot className="w-5 h-5 text-slate-600" />
                                            </div>
                                        )}

                                        <div className={`max-w-2xl flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-6 rounded-2xl shadow-sm leading-relaxed text-[15px] ${msg.role === 'user'
                                                ? 'bg-slate-800 text-white rounded-br-none shadow-lg shadow-slate-200'
                                                : 'bg-slate-50 text-slate-700 rounded-bl-none border border-slate-100'
                                                }`}>
                                                <div className="font-medium markdown-content">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white" {...props} /></div>,
                                                            thead: ({ node, ...props }) => <thead className="bg-slate-50" {...props} />,
                                                            th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200" {...props} />,
                                                            tbody: ({ node, ...props }) => <tbody className="divide-y divide-slate-200" {...props} />,
                                                            tr: ({ node, ...props }) => <tr className="hover:bg-slate-50/50 transition-colors" {...props} />,
                                                            td: ({ node, ...props }) => <td className="px-4 py-3 text-sm text-slate-600 whitespace-pre-wrap align-top" {...props} />,
                                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                                            li: ({ node, ...props }) => <li className="" {...props} />,
                                                            a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                            code: ({ node, inline, className, children, ...props }) => {
                                                                return inline ?
                                                                    <code className="bg-slate-200/50 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800" {...props}>{children}</code> :
                                                                    <pre className="bg-slate-900 text-slate-50 p-4 rounded-xl overflow-x-auto mb-4 text-sm font-mono"><code {...props}>{children}</code></pre>
                                                            }
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                    {isGenerating && idx === chatHistory.length - 1 && msg.role === 'bot' && <span className="inline-block w-1.5 h-4 bg-slate-400 ml-2 animate-pulse align-middle rounded-full"></span>}
                                                </div>

                                                {msg.role === 'bot' && msg.sources && msg.sources.length > 0 && (
                                                    <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col gap-3">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                            <Quote className="w-3 h-3" /> References
                                                        </span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {msg.sources.map((src, srcIdx) => (
                                                                <button
                                                                    key={srcIdx}
                                                                    onClick={() => handleSourceClick(src.text)}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-xs font-bold rounded-lg hover:bg-amber-50 hover:text-amber-700 hover:border-amber-100 hover:shadow-sm transition-all border border-slate-200"
                                                                >
                                                                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                                                    {src.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {msg.role === 'user' && (
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-2">
                                                <User className="w-5 h-5 text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} className="h-2" />
                        </div>

                        <div className="p-8 pt-0">
                            <div className="max-w-4xl mx-auto relative group">
                                <div className="relative flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm focus-within:shadow-md focus-within:border-slate-300 transition-all">
                                    <Search className="w-5 h-5 text-slate-300" />
                                    <input type="text" value={inputQuery} onChange={(e) => setInputQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} disabled={!activeCollection || isGenerating} placeholder={activeCollection ? "Ask about this document..." : "Select a collection first..."} className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 font-medium disabled:cursor-not-allowed" />
                                    <button onClick={handleSendMessage} disabled={!activeCollection || isGenerating || !inputQuery.trim()} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all transform active:scale-95 shadow-md"><Send className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DOCUMENT VIEWER */}
                    {showDocument && activeCollection && (
                        <div className="w-[45%] bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col animate-in slide-in-from-right-10 duration-500 overflow-hidden">
                            <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-700"><FileText className="w-4 h-4" /></div>
                                    <span className="font-bold text-slate-800 truncate">{activeCollection.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowDocument(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50 custom-scrollbar">
                                <div className="bg-white shadow-lg shadow-slate-100 min-h-[800px] w-full rounded-2xl p-16 text-slate-700 font-serif leading-loose select-text cursor-text border border-slate-100">
                                    <h1 className="text-4xl font-bold mb-4 text-slate-900">{activeCollection.name.replace(/_/g, ' ')}</h1>
                                    <div className="flex items-center gap-2 mb-12">
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confidential</span>
                                        <span className="text-xs text-slate-400 font-medium">Generated {activeCollection.date}</span>
                                    </div>

                                    {renderDocContent(docContent, highlightedText)}

                                    <div className="mt-16 pt-16 border-t border-slate-100">
                                        <div className="h-4 w-1/3 bg-slate-100 rounded-full mb-4"></div>
                                        <div className="h-4 w-2/3 bg-slate-100 rounded-full mb-4"></div>
                                        <div className="h-4 w-1/2 bg-slate-100 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            {/* UPLOAD MODAL */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-lg">Upload Document</h3>
                            <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Collection Name</label>
                                <input
                                    type="text"
                                    value={uploadCollectionName}
                                    onChange={(e) => setUploadCollectionName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all outline-none text-slate-800 font-medium"
                                    placeholder="Enter collection name..."
                                    autoFocus
                                />
                                <p className="text-xs text-slate-400 mt-2 ml-1">
                                    This name will be used to identify your document collection.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 truncate">{selectedFile?.name}</p>
                                    <p className="text-xs text-slate-400">{(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-white rounded-xl transition-all">Cancel</button>
                            <button onClick={handleUploadSubmit} disabled={!uploadCollectionName.trim()} className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-200 disabled:opacity-50 disabled:shadow-none transition-all">Upload</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
