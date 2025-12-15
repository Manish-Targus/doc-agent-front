import React from 'react';
import ReactDOM from 'react-dom';

/**
 * A wrapper component for displaying content in a modal overlay.
 * @param {object} props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {function} props.onClose - Function to close the modal (optional, used for overlay click)
 * @param {React.ReactNode} props.children - The content to display inside the modal body
 */
export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  // Render using a Portal to escape the parent container's styling context
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* --- Overlay Background (Click to close) --- */}
      <div 
        className="fixed inset-0 bg-black opacity-50" 
        onClick={onClose} 
      />

      {/* --- Modal Content Container --- */}
      {/* We use z-50 to ensure the modal content is above the z-50 overlay */}
      <div className="bg-white rounded-lg shadow-2xl z-[51] ">
        
        {children}

      </div>
    </div>,
    document.body // Appends the modal to the body of the HTML document
  );
}
