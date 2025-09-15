import './WallpaperPicker.css';

export const WallpaperPicker = (props: { currentWallpaper?: string, onWallpaperChange: (wallpaper: string) => void }) => {
    const { currentWallpaper, onWallpaperChange } = props;

    const handleWallpaperChange = (wallpaper: string) => {
        onWallpaperChange(wallpaper);
    }
    
    return (
        <div className="wallpaper-picker">
            
        </div>
    )
}