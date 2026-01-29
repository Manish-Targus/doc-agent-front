// components/DashboardView.js
"use client"

import React, { useState, useRef, useEffect } from 'react';
import {
    Bot, User, FileText, Search, Send, Upload, Eye, EyeOff, X,
    Quote, BookOpen, LayoutGrid
} from 'lucide-react';
import styles from './DashboardView.module.css';

// --- MOCK DATA ---
const MOCK_COLLECTIONS = [
    { id: '1', name: 'HR_Policies_2024', size: '2.4 MB', date: 'Oct 24' },
    { id: '2', name: 'Project_Alpha', size: '1.1 MB', date: 'Nov 02' },
];

const MOCK_CONTENT = `1. INTRODUCTION
The purpose of this document is to outline the core requirements.

2. TIMELINE
Q1 2025: Initial Kickoff and Planning.
Q2 2025: Core Development Phase.`;

export default function DashboardView({ onLogout }) {
    const [activeId, setActiveId] = useState('1');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showDoc, setShowDoc] = useState(false);
    const [highlight, setHighlight] = useState(null);
    const scrollRef = useRef(null);

    const activeDoc = MOCK_COLLECTIONS.find(c => c.id === activeId);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: "Based on the document, the timeline starts in Q1 2025.",
                sources: [{ label: "Section 2", text: "Q1 2025: Initial Kickoff" }]
            }]);
        }, 600);
    };

    const renderDocContent = (text, highlightText) => {
        if (!highlightText) return <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>;
        const parts = text.split(new RegExp(`(${highlightText})`, 'gi'));
        return (
            <div style={{ whiteSpace: 'pre-wrap' }}>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlightText.toLowerCase()
                        ? <mark key={i} className={styles.highlight}>{part}</mark>
                        : part
                )}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {/* SIDEBAR */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoRow}>
                        <div className={styles.logoIcon}><LayoutGrid size={20} /></div>
                        <h2 style={{ fontWeight: 800 }}>DocuBot</h2>
                    </div>
                    <div className={styles.searchBox}>
                        <Search size={16} className={styles.searchIcon} />
                        <input className={styles.searchInput} placeholder="Search files..." />
                    </div>
                </div>

                <div className={styles.collectionList}>
                    {MOCK_COLLECTIONS.map(col => (
                        <div
                            key={col.id}
                            className={`${styles.collectionItem} ${activeId === col.id ? styles.activeItem : ''}`}
                            onClick={() => setActiveId(col.id)}
                        >
                            <div className={styles.fileIcon}><FileText size={20} /></div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{col.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{col.size} • {col.date}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.uploadArea}>
                    <button className={styles.quickBtn}><Upload size={16} /> Quick Upload</button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className={styles.main}>
                <div className={styles.topBar}>
                    <div className={styles.activePill}>
                        <span className={styles.indicator}></span>
                        <span style={{ fontWeight: 700 }}>{activeDoc?.name}</span>
                        <div style={{ width: 1, height: 16, background: '#e2e8f0' }}></div>
                        <button onClick={() => setShowDoc(!showDoc)} className={styles.contextBtn}>
                            {showDoc ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showDoc ? ' Hide' : ' View'}
                        </button>
                    </div>
                    <div>
                        <button className={styles.actionBtn} onClick={onLogout}>Logout</button>
                    </div>
                </div>

                <div className={styles.splitView}>
                    <div className={styles.chatPanel}>
                        <div className={styles.messages}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                                    <div style={{ width: 60, height: 60, background: '#f8fafc', borderRadius: 20, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Bot size={32} color="#94a3b8" />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>How can I help?</h3>
                                    <p style={{ color: '#64748b' }}>Ask questions about {activeDoc?.name}</p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={styles.messageRow}>
                                    {msg.role === 'bot' && <div className={styles.botAvatar}><Bot size={20} /></div>}
                                    <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                                        {msg.content}
                                        {msg.sources && (
                                            <div className={styles.refContainer}>
                                                <span className={styles.refLabel}><Quote size={10} /> Reference</span>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {msg.sources.map((src, idx) => (
                                                        <button key={idx} className={styles.refBtn} onClick={() => { setHighlight(src.text); setShowDoc(true); }}>
                                                            <BookOpen size={12} /> {src.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === 'user' && <div className={styles.userAvatar}><User size={20} /></div>}
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        <div className={styles.inputArea}>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={styles.mainInput}
                                    placeholder="Ask a question..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button className={styles.sendBtn} onClick={handleSend}><Send size={18} /></button>
                            </div>
                        </div>
                    </div>

                    {showDoc && (
                        <div className={styles.docPanel}>
                            <div className={styles.docHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                                    <FileText size={18} color="#d97706" /> {activeDoc?.name}
                                </div>
                                <button onClick={() => setShowDoc(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#94a3b8" /></button>
                            </div>
                            <div className={styles.docBody}>
                                <div className={styles.paper}>
                                    {renderDocContent(MOCK_CONTENT, highlight)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}