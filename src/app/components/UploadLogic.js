// components/UploadView.js
import React, { useState, useRef } from 'react';
import { ChevronLeft, Cloud, CheckCircle2 } from 'lucide-react';
import styles from './UploadView.module.css';

export default function UploadView({ onComplete, onNavigateToChat, onBack }) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);
    const inputRef = useRef(null);

    const handleFile = (e) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            setIsUploading(true);

            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(interval);
                        setFile(f);
                        setIsUploading(false);
                        onComplete({ id: Date.now().toString(), name: f.name, size: "2MB", date: "Just now" });
                        return 100;
                    }
                    return p + 5;
                });
            }, 50);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backBtn}><ChevronLeft /></button>
                <h2>Upload Center</h2>
            </div>
            <div className={styles.content}>
                <div className={styles.card}>
                    {!file ? (
                        <>
                            <div className={styles.icon}><Cloud size={48} /></div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Upload Document</h2>
                            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Drag and drop PDF or DOCX files here.</p>

                            {isUploading ? (
                                <div className={styles.progressContainer}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}><span>Uploading...</span><span>{progress}%</span></div>
                                    <div className={styles.barBg}><div className={styles.barFill} style={{ width: `${progress}%` }} /></div>
                                </div>
                            ) : (
                                <button onClick={() => inputRef.current.click()} className={styles.btnPrimary}>Select File</button>
                            )}
                            <input type="file" hidden ref={inputRef} onChange={handleFile} />
                        </>
                    ) : (
                        <div className="animate-in fade-in zoom-in">
                            <div className={`${styles.icon} ${styles.successIcon}`}><CheckCircle2 size={48} /></div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Complete!</h2>
                            <p style={{ marginBottom: '2rem' }}>{file.name} is ready.</p>
                            <div>
                                <button onClick={() => { setFile(null); setProgress(0); }} className={styles.btnSecondary}>Upload Another</button>
                                <button onClick={onNavigateToChat} className={styles.btnPrimary}>Go to Chat</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}