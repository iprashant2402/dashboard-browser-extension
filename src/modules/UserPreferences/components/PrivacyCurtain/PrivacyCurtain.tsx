import { useQuery } from '@tanstack/react-query';
import Clock from '../../../../components/Clock/Clock';
import './PrivacyCurtain.css';
import { getRandomWallpaper } from '../../../Themes/wallpaper/api';
import { useEffect, useRef } from 'react';
import { UserPreference } from '../../types/UserPreference';
import { useUserPreferences } from '../../hooks/useUserPreferences';

const getWallpaper = async (preferences: UserPreference) => {
    if (preferences.wallpaper) return preferences.wallpaper;
    const wallpaper = await getRandomWallpaper();
    return wallpaper.urls.full;
}

export const PrivacyCurtain = () => {
    const curtainRef = useRef<HTMLDivElement>(null);
    const { userPreferences } = useUserPreferences();

    const { data: wallpaper } = useQuery({
        queryKey: ['wallpaper'],
        queryFn: () => getWallpaper(userPreferences),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (wallpaper && curtainRef.current) {
            curtainRef.current.style.backgroundImage = `url(${wallpaper})`;
            curtainRef.current.style.backgroundSize = 'cover';
            curtainRef.current.style.backgroundPosition = 'center';
            curtainRef.current.style.backgroundRepeat = 'no-repeat';
            curtainRef.current.style.backgroundAttachment = 'fixed';
            curtainRef.current.style.opacity = '0.5';
            curtainRef.current.style.transition = 'opacity 0.3s ease-in-out';
            curtainRef.current.style.zIndex = '1000';
        }
    }, [wallpaper]);

    return (
        <div className="privacy-curtain" ref={curtainRef}>
            <div className="clock-container">
                <Clock />
            </div>
        </div>
    );
};