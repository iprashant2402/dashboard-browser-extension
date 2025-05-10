import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FamilyDialog.css';

interface FamilyDialogProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
}

const FamilyDialog: React.FC<FamilyDialogProps> = ({
  trigger,
  children,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleOpen = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.top
      });
      setDimensions({
        width: rect.width,
        height: rect.height
      });
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="family-dialog-container" ref={containerRef}>
      <div className="family-dialog-trigger" onClick={handleOpen}>
        {trigger}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="family-dialog-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            
            <motion.div
              className="family-dialog"
              initial={{ 
                x: position.x,
                y: position.y,
                width: dimensions.width,
                height: dimensions.height,
                borderRadius: 8,
                opacity: 0.5
              }}
              animate={{ 
                x: 0,
                y: 0,
                width: '80%',
                height: '80%',
                opacity: 1
              }}
              exit={{ 
                x: position.x,
                y: position.y,
                width: dimensions.width,
                height: dimensions.height,
                borderRadius: 8,
                opacity: 0
              }}
              transition={{ 
                type: "spring",
                damping: 30,
                stiffness: 300
              }}
            >
              <div className="family-dialog-content">
                <div className="family-dialog-header">
                  <button className="family-dialog-close" onClick={handleClose}>
                    &times;
                  </button>
                </div>
                <div 
                className="family-dialog-body"
                >
                  {children}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyDialog;