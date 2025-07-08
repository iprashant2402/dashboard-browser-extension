import React, { useEffect, useState } from 'react';
import { IoCheckmarkCircle, IoWarning, IoCloseCircle, IoClose } from 'react-icons/io5';
import './index.css';

export type ToastType = 'success' | 'warning' | 'error';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
  onDismiss: (id: string) => void;
}

const getToastIcon = (type: ToastType, customIcon?: React.ReactNode): React.ReactNode => {
  if (customIcon) return customIcon;
  
  switch (type) {
    case 'success':
      return <IoCheckmarkCircle className="toast-icon" />;
    case 'warning':
      return <IoWarning className="toast-icon" />;
    case 'error':
      return <IoCloseCircle className="toast-icon" />;
    default:
      return null;
  }
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  icon,
  duration = 5000,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(id), 300); // Wait for fade out animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [id, duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-content">
        <div className="toast-icon-wrapper">
          {getToastIcon(type, icon)}
        </div>
        <div className="toast-message">
          {message}
        </div>
        <button 
          className="toast-close" 
          onClick={handleDismiss}
          aria-label="Close notification"
        >
          <IoClose />
        </button>
      </div>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}; 