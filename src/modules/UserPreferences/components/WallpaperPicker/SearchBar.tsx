import { useState } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';
import './WallpaperPicker.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search wallpapers...", 
  disabled = false 
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  return (
    <div 
      className={`search-bar ${isFocused ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <IoSearch className="search-bar-icon" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="search-bar-input"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={(e) => e.stopPropagation()}
      />
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
          className="search-bar-clear"
          aria-label="Clear search"
          disabled={disabled}
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
}; 