import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import './index.css';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  size?: 'small' | 'medium' | 'large' | 'full';
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
  footer?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  size = 'medium',
  position = 'center',
  footer
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Handle animation on open/close
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scrolling when dialog is open
      document.body.style.overflow = 'hidden';
    } else {
      // Allow small delay for close animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, isOpen, onClose]);
  
  // Handle outside click
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // Don't render anything if dialog is not open and not animating
  if (!isOpen && !isAnimating) {
    return null;
  }
  
  return createPortal(
    <div 
      className={`dialog-overlay ${isOpen ? 'dialog-open' : 'dialog-closing'}`}
      onClick={handleOutsideClick}
      aria-hidden={!isOpen}
    >
      <div 
        ref={dialogRef}
        className={`dialog dialog-${size} dialog-position-${position} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
      >
        {(title || showCloseButton) && (
          <div className="dialog-header">
            {title && <h2 id="dialog-title" className="dialog-title">{title}</h2>}
            {showCloseButton && (
              <button 
                className="dialog-close-button" 
                onClick={onClose}
                aria-label="Close dialog"
              >
                <IoClose size={24} />
              </button>
            )}
          </div>
        )}
        
        <div className="dialog-content">
          {children}
        </div>
        
        {footer && (
          <div className="dialog-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}; 