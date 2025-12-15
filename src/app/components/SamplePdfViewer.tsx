// components/SamplePdfViewer.tsx
import React, { useState } from 'react';
import PdfViewer from './PdfViewer';

// You can use a sample PDF URL or local PDF file
const SAMPLE_PDF_URL ="https://pdfobject.com/pdf/sample.pdf"

const SamplePdfViewer: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<string | File | null>(SAMPLE_PDF_URL);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [useSample, setUseSample] = useState<boolean>(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFileInput(file);
      setPdfFile(file);
      setUseSample(false);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleLoadSample = () => {
    setPdfFile(SAMPLE_PDF_URL);
    setUseSample(true);
    setFileInput(null);
  };

  const handleClear = () => {
    setPdfFile(null);
    setFileInput(null);
    setUseSample(false);
  };

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log(`PDF loaded successfully with ${numPages} pages`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">React PDF Viewer</h1>
          <p className="text-gray-600">View PDF files with zoom, rotation, and navigation controls</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">PDF Controls</h2>
              
              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PDF File
                  </label>
                  <div className="flex flex-col space-y-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF files only</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    
                    {fileInput && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-green-700 font-medium">{fileInput.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sample PDF Controls */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Sample PDF</h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleLoadSample}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        useSample
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Load Sample PDF
                    </button>
                    <button
                      onClick={handleClear}
                      className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Features List */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Zoom in/out</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Page navigation</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Rotation</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Text selection</span>
                    </li>
                  </ul>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-700 mb-2">How to use:</h4>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Upload your own PDF or use the sample</li>
                    <li>• Use navigation buttons to change pages</li>
                    <li>• Zoom in/out with +/- buttons</li>
                    <li>• Click rotate button to rotate the PDF</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - PDF Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">PDF Preview</h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF Viewer
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-[600px]">
                <PdfViewer
                  file={pdfFile}
                  onLoadSuccess={handleLoadSuccess}
                  className="h-full"
                />
              </div>
              
              {useSample && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Currently viewing sample PDF document
                  </div>
                </div>
              )}
            </div>

            {/* Stats/Info Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">File Type</p>
                    <p className="font-semibold text-gray-800">PDF Document</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Security</p>
                    <p className="font-semibold text-gray-800">Client-side Only</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Compatibility</p>
                    <p className="font-semibold text-gray-800">All Modern Browsers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplePdfViewer;