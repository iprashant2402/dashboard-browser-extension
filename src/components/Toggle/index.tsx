import { useState, useCallback } from "react";
import "./index.css";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  id?: string;
  className?: string;
}

export const Toggle = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'medium',
  label,
  id,
  className = '',
}: ToggleProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  }, [isChecked, disabled, onChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  return (
    <div className={`toggle-wrapper ${className}`}>
      {label && (
        <label htmlFor={id} className="toggle-label">
          {label}
        </label>
      )}
      <div
        className={`toggle-switch ${size} ${isChecked ? 'checked' : 'unchecked'} ${
          disabled ? 'disabled' : ''
        }`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={isChecked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        id={id}
      >
        <div className="toggle-track">
          <div className="toggle-thumb"></div>
        </div>
      </div>
    </div>
  );
}; 