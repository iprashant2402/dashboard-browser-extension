import { useState, useMemo } from 'react';
import { Dialog } from '../../../../components/Dialog';
import { useRandomWallpapers, useSearchWallpapers } from '../../../Themes/wallpaper/hooks';
import { UnsplashPhoto } from '../../../Themes/wallpaper/types';
import { useDebounce } from '../../../../utils/useDebounce';
import { WallpaperThumbnail } from './WallpaperThumbnail';
import { SearchBar } from './SearchBar';
import './WallpaperPicker.css';

interface WallpaperPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onWallpaperSelect: (wallpaper: UnsplashPhoto) => void;
  currentWallpaper?: {
    url: string;
    author: string;
    authorUrl: string;
  };
  isApplyingWallpaper?: boolean;
}

export const WallpaperPickerDialog = ({
  isOpen,
  onClose,
  onWallpaperSelect,
  currentWallpaper,
  isApplyingWallpaper = false
}: WallpaperPickerDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch random wallpapers
  const {
    data: randomWallpapers,
    isLoading: isLoadingRandom,
    error: randomError
  } = useRandomWallpapers(14);

  // Fetch search results
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    error: searchError
  } = useSearchWallpapers(debouncedSearchQuery, 1, debouncedSearchQuery.length > 0);

  // Determine which wallpapers to display
  const displayWallpapers = useMemo(() => {
    if (debouncedSearchQuery.length > 0) {
      return searchResults?.results || [];
    }
    return randomWallpapers || [];
  }, [debouncedSearchQuery, searchResults, randomWallpapers]);

  const isLoading = debouncedSearchQuery.length > 0 ? isLoadingSearch : isLoadingRandom;
  const error = debouncedSearchQuery.length > 0 ? searchError : randomError;
  const isInteractionDisabled = isLoading || isApplyingWallpaper;

  const handleWallpaperClick = (wallpaper: UnsplashPhoto) => {
    onWallpaperSelect(wallpaper);
    onClose();
  };

  const getCurrentWallpaperFromList = () => {
    if (!currentWallpaper) return null;
    return displayWallpapers.find(wallpaper => 
      wallpaper.urls.full === currentWallpaper.url ||
      wallpaper.urls.regular === currentWallpaper.url ||
      wallpaper.urls.small === currentWallpaper.url
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Wallpaper"
      size="large"
      className="wallpaper-picker-dialog"
    >
      <div 
        className="wallpaper-picker-dialog-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="wallpaper-picker-search">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for wallpapers..."
            disabled={isInteractionDisabled}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="wallpaper-picker-loading">
            <div className="loading-spinner"></div>
            <p>Loading wallpapers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="wallpaper-picker-error">
            <p>Failed to load wallpapers. Please try again.</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Wallpapers Grid */}
        {!isLoading && !error && (
          <>
            {displayWallpapers.length === 0 && debouncedSearchQuery.length > 0 && (
              <div className="wallpaper-picker-empty">
                <p>No wallpapers found for "{debouncedSearchQuery}"</p>
                <p className="wallpaper-picker-empty-subtitle">Try a different search term</p>
              </div>
            )}

            {displayWallpapers.length > 0 && (
              <div 
                className="wallpaper-picker-grid"
                onClick={(e) => e.stopPropagation()}
              >
                {displayWallpapers.map((wallpaper) => (
                  <WallpaperThumbnail
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    isSelected={wallpaper.id === getCurrentWallpaperFromList()?.id}
                    onClick={() => handleWallpaperClick(wallpaper)}
                    size="medium"
                  />
                ))}
              </div>
            )}

            {/* Search Results Info */}
            {debouncedSearchQuery.length > 0 && searchResults && (
              <div className="wallpaper-picker-results-info">
                Showing {searchResults.results.length} of {searchResults.total} results for "{debouncedSearchQuery}"
              </div>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}; 