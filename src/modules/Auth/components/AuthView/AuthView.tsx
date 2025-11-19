import { useEffect, useRef } from "react";
import { getRandomWallpaper } from "../../../Themes/wallpaper";
import { UserPreference } from "../../../UserPreferences/types/UserPreference";
import { useUserPreferences } from "../../../UserPreferences/hooks/useUserPreferences";
import { useQuery } from "@tanstack/react-query";
import './AuthView.css';
import { AuthMenuContent } from "../AuthDialog/AuthMenuContent";

const getWallpaper = async (preferences: UserPreference) => {
    if (preferences.wallpaper) return preferences.wallpaper.url;
    const wallpaper = await getRandomWallpaper();
    return wallpaper.urls.full;
}

export const AuthView = () => {
    const backgroundRef = useRef<HTMLDivElement>(null);
    const { userPreferences } = useUserPreferences();

    const { data: wallpaper } = useQuery({
        queryKey: ['wallpaper'],
        queryFn: () => getWallpaper(userPreferences),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (wallpaper && backgroundRef.current) {
            backgroundRef.current.style.backgroundImage = `url(${wallpaper})`;
            backgroundRef.current.style.backgroundSize = 'cover';
            backgroundRef.current.style.backgroundPosition = 'center';
            backgroundRef.current.style.backgroundRepeat = 'no-repeat';
            backgroundRef.current.style.backgroundAttachment = 'fixed';
            backgroundRef.current.style.zIndex = '1001';
        }
    }, [wallpaper]);

    return (
        <div className="auth-view" ref={backgroundRef}>
            <div className="form-container white-paper-lite">
                <AuthMenuContent />
            </div>
            <div className="wallpaper-attribution">
            {userPreferences.wallpaper && <span className="attribution">(Photo by&nbsp;
                        <a href={userPreferences.wallpaper.authorUrl + '?utm_source=insquoo&utm_medium=referral'} target="_blank" rel="noopener noreferrer">
                            {userPreferences.wallpaper.author}
                        </a>
                        &nbsp;on <a href="https://unsplash.com?utm_source=insquoo&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash</a>)
                </span>}
            </div>
        </div>
    );
};