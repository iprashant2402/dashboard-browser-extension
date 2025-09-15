import { UnsplashPhoto } from '../../../Themes/wallpaper/types';
import './WallpaperPicker.css';

interface WallpaperThumbnailProps {
  wallpaper: UnsplashPhoto;
  isSelected?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const WallpaperThumbnail = ({ 
  wallpaper, 
  isSelected = false, 
  size = 'medium',
  onClick 
}: WallpaperThumbnailProps) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'wallpaper-thumbnail-small';
      case 'large': return 'wallpaper-thumbnail-large';
      default: return 'wallpaper-thumbnail-medium';
    }
  };

  return (
    <div 
      className={`wallpaper-thumbnail ${getSizeClass()} ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title={wallpaper.alt_description || `Photo by ${wallpaper.user.name}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onClick?.();
        }
      }}
    >
      <img 
        src={wallpaper.urls.thumb} 
        alt={wallpaper.alt_description || `Photo by ${wallpaper.user.name}`}
        loading="lazy"
      />
      {isSelected && (
        <div className="wallpaper-thumbnail-selected-indicator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path 
              d="M20 6L9 17L4 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}; 