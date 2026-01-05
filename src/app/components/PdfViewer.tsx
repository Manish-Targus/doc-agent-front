"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface PdfViewerProps {
  file?: string | File | null;
  url?: string;
  className?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file, url, className = '' }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewerKey, setViewerKey] = useState<number>(0);

  const loadPdf = useCallback(async () => {
    // 1. Determine the source
    const targetSource = url || (typeof file === 'string' ? file : null);
    
    if (!targetSource && !(file instanceof File)) {
      setFileUrl(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (file instanceof File) {
        // Handle local browser file
        if (file.type !== 'application/pdf') {
          throw new Error('Invalid file type. Please select a PDF.');
        }
        const localBlob = URL.createObjectURL(file);
        setFileUrl(localBlob);
        // Cleanup blob on unmount
        return () => URL.revokeObjectURL(localBlob);
      } 
      
      else if (targetSource) {
        // Handle GeM/External URL via Proxy
        // This solves the "Insecure Connection" and "Mixed Content" errors
        const proxiedUrl = `/api/proxy-pdf?url=${encodeURIComponent(targetSource)}`;
        setFileUrl(proxiedUrl);
        setViewerKey(prev => prev + 1);
      }
    } catch (err: any) {
      console.error("PDF Load Error:", err);
      setError(err.message || "Failed to load PDF");
      setIsLoading(false);
    }
  }, [file, url]);

  // Trigger loading whenever the file or url props change
  useEffect(() => {
    loadPdf();
  }, [loadPdf]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Browser blocked the PDF viewer or the file is unreachable.');
  };

  // UI for Empty State
  if (!fileUrl && !isLoading && !error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[500px] ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-center">No PDF selected to view</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Document Viewer</h3>
        <div className="flex space-x-2">
          {fileUrl && (
            <>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              Open Fullscreen
            </a>
            <a
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"

            
            href="">
              Continue to chat
            </a>
            </>
          )}
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 relative bg-gray-100 min-h-[600px]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Secure PDF Stream...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6 z-20">
            <p className="text-red-600 font-medium mb-4 text-center">{error}</p>
            <button
              onClick={() => loadPdf()}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Retry
            </button>
          </div>
        )}

        {fileUrl && (
          <iframe
            key={viewerKey}
            src={fileUrl}
            className="w-full h-full min-h-[600px] border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="PDF Viewer"
          />
        )}
      </div>
    </div>
  );
};

export default PdfViewer;