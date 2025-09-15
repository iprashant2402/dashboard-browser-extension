import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { UnsplashPhoto } from '../../../Themes/wallpaper/types';
import { WallpaperPickerDialog } from './WallpaperPickerDialog';
import { AnalyticsTracker } from '../../../../analytics/AnalyticsTracker';
import { setWallpaper } from '../../../../utils/wallpaper';
import './WallpaperPicker.css';

export const WallpaperPicker = () => {
    const { userPreferences, updatePreferences } = useUserPreferences();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isApplyingWallpaper, setIsApplyingWallpaper] = useState(false);

    const handleWallpaperChange = async (wallpaper: UnsplashPhoto) => {
        try {
            setIsApplyingWallpaper(true);
            updatePreferences({ wallpaper: {
                url: wallpaper.urls.full,
                author: wallpaper.user.name,
                authorUrl: wallpaper.user.links.html,
            } });
            // Apply wallpaper immediately
            await setWallpaper(wallpaper.urls.full);
            AnalyticsTracker.track('Wallpaper - Selected');
        } catch (error) {
            console.error('Failed to set wallpaper:', error);
        } finally {
            setIsApplyingWallpaper(false);
        }
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
        AnalyticsTracker.track('Wallpaper picker - Open');
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };
    
    return (
        <>
            <div className="wallpaper-picker">
                <div 
                    className="wallpaper-picker-thumbnail"
                    onClick={handleOpenDialog}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenDialog();
                        }
                    }}
                    title="Click to change wallpaper"
                >
                    {userPreferences.wallpaper ? (
                            <img 
                            src={userPreferences.wallpaper.url} 
                            alt="Current wallpaper"
                            className="wallpaper-picker-current-image"
                        />
                    ) : (
                        <div className="wallpaper-picker-placeholder">
                            <IoAdd size={24} />
                            <span>Add Wallpaper</span>
                        </div>
                    )}
                </div>
                {userPreferences.wallpaper && <span className="attribution">(Photo by&nbsp;
                        <a href={userPreferences.wallpaper.authorUrl} target="_blank" rel="noopener noreferrer">
                            {userPreferences.wallpaper.author}
                        </a>
                        &nbsp;on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>)
                </span>}
            </div>

            <WallpaperPickerDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onWallpaperSelect={handleWallpaperChange}
                currentWallpaper={userPreferences.wallpaper}
                isApplyingWallpaper={isApplyingWallpaper}
            />
        </>
    );
};