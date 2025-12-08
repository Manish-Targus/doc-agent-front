import React, { useState, useRef } from 'react';
import { ChevronLeft, Cloud, CheckCircle2, X, FileText } from 'lucide-react';
import { api } from '../utils/api';

export default function UploadView({ onComplete, onNavigateToChat, onBack }) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState(null);

    // Upload Modal State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadCollectionName, setUploadCollectionName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef(null);

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
        setProgress(10);
        setShowUploadModal(false);

        try {
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const result = await api.upload(selectedFile, uploadCollectionName);

            clearInterval(progressInterval);
            setProgress(100);

            const newDoc = {
                id: result.id || Date.now().toString(),
                name: uploadCollectionName,
                size: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                type: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'
            };

            onComplete(newDoc);
            setUploadedFile(selectedFile.name);
        } catch (error) {
            console.error("Upload failed:", error);
            alert(`Upload failed: ${error.message}`);
            setProgress(0);
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
            setUploadCollectionName("");
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="h-20 flex items-center px-8">
                <button onClick={onBack} className="p-3 bg-white hover:bg-slate-50 rounded-xl text-slate-600 mr-4 transition-colors shadow-sm border border-slate-100"><ChevronLeft className="w-6 h-6" /></button>
                <span className="font-bold text-2xl text-slate-800">Upload Center</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-12 text-center">
                    {!uploadedFile ? (
                        <>
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <Cloud className="w-10 h-10 text-slate-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">Upload your documents</h2>
                            <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">Drag and drop your PDF, DOCX, or TXT files here.</p>
                            {isUploading ? (
                                <div className="max-w-xs mx-auto">
                                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-3"><span>Uploading...</span><span>{progress}%</span></div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-slate-800 transition-all duration-200" style={{ width: `${progress}%` }}></div></div>
                                </div>
                            ) : (
                                <button onClick={() => fileInputRef.current?.click()} className="px-10 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-lg shadow-slate-300">Select Files</button>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                        </>
                    ) : (
                        <div className="animate-in zoom-in-50 duration-500">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">Upload Complete!</h2>
                            <p className="text-slate-500 mb-10 text-lg">
                                <span className="font-bold text-slate-800">{uploadedFile}</span> is ready.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button onClick={() => { setUploadedFile(null); setProgress(0); }} className="px-8 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Upload Another</button>
                                <button onClick={onNavigateToChat} className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-slate-300 transition-all hover:scale-105">Proceed to Chat</button>
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
