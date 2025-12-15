// components/PdfViewer.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface PdfViewerProps {
  file: string | File | null;
  className?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file, className = '' }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewerKey, setViewerKey] = useState<number>(0);

  // Safely handle file conversion
  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return;
    }

    try {
      if (typeof file === 'string') {
        // Validate string URL
        if (file.trim() === '') {
          setError('Invalid file URL');
          setFileUrl(null);
          return;
        }
        setFileUrl(file);
      } else if (file instanceof File) {
        // Check if File is valid
        if (!file.type || file.type !== 'application/pdf') {
          setError('Invalid file type. Please select a PDF file.');
          setFileUrl(null);
          return;
        }
        
        // Create object URL
        const url = URL.createObjectURL(file);
        setFileUrl(url);
        
        // Cleanup function
        return () => {
          URL.revokeObjectURL(url);
        };
      } else {
        setError('Invalid file type');
        setFileUrl(null);
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process file');
      setFileUrl(null);
    }
  }, [file]);

  // Reset error when file changes
  useEffect(() => {
    if (file) {
      setError(null);
      setIsLoading(true);
      // Increment key to force iframe reload
      setViewerKey(prev => prev + 1);
    }
  }, [file]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load PDF. Please check if the file is valid.');
  };

  const retryLoad = () => {
    setError(null);
    setIsLoading(true);
    setViewerKey(prev => prev + 1);
  };

  const loadSamplePdf = () => {
    const samplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    setFileUrl(samplePdfUrl);
    setError(null);
    setIsLoading(true);
    setViewerKey(prev => prev + 1);
  };

  if (!file) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[500px] ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-center mb-4">No PDF file selected</p>
        <button
          onClick={loadSamplePdf}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          Try Sample PDF
        </button>
        <p className="text-gray-400 text-sm mt-4">
          Or select a PDF file to view
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full w-500 border rounded-lg overflow-hidden ${className}`}>
      {/* Header with controls */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">PDF Viewer</h3>
            {file instanceof File && (
              <span className="text-sm text-gray-500 truncate max-w-xs">
                {file.name}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {fileUrl && (
              <>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
              >
                Open in New Tab
              </a>
              <a
                href={`#`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
              >
                Continue Chat
              </a>
              
              </>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 relative bg-gray-100 min-h-[500px] min-w-[500px]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading PDF...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6 z-10">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium text-lg mb-2 text-center">{error}</p>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={retryLoad}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Retry Loading
              </button>
              <button
                onClick={loadSamplePdf}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              >
                Try Sample PDF
              </button>
            </div>
          </div>
        )}

        {/* PDF Display */}
        {fileUrl && (
          <div className="w-full h-full">
            <iframe
              key={viewerKey}
              src={fileUrl}
              className=" min-h-[600px] min-w-[1000px] full border-0"
              title="PDF Viewer"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
  // sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        )}

        {fileUrl && !error && !isLoading && (
          <div className="hidden">
            <object
              data={fileUrl}
              type="application/pdf"
              className="w-full h-full"
              aria-label="PDF Document"
            >
              <p>
                Your browser does not support PDFs. 
                <a href={fileUrl} download>Download the PDF</a> instead.
              </p>
            </object>
          </div>
        )}
      </div>

      {/* <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            {file instanceof File && (
              <span>Size: {(file.size / 1024).toFixed(2)} KB</span>
            )}
          </div>
          <div className="text-xs">
            PDF displayed using browser's built-in viewer
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PdfViewer;