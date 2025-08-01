import './TopSites.css';
import { useTopSites } from "../../hooks/useTopSites";
import { useState } from 'react';
import { useUserPreferences } from '../../../UserPreferences/components/UserPreferencesProvider';

export const TopSites = () => {
    const { userPreferences } = useUserPreferences();
    const { topSites } = useTopSites();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSiteClick = (url: string) => {
        window.open(url, '_self');
    };

    const handleMouseEnter = () => {
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        setIsExpanded(false);
    };

    if (topSites.length === 0 || !userPreferences.quickAccessPanelEnabled) {
        return null;
    }

    return (
        <div 
            className={`top-sites-container ${isExpanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="top-sites-header">
                <h3 className="top-sites-title">Quick <span>Access</span></h3>
                <p className="top-sites-description">Your most visited sites</p>
            </div>
            <div className="top-sites-grid">
                {topSites.map((site) => (
                    <div 
                        key={site.url} 
                        className="top-site-item"
                        onClick={() => handleSiteClick(site.url)}
                        title={site.title}
                    >
                        <div className="top-site-thumbnail">
                            <img 
                                src={site.favicon} 
                                alt={site.title}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.classList.add('no-favicon');
                                        parent.textContent = site.title.charAt(0).toUpperCase();
                                    }
                                }}
                            />
                        </div>
                        <div className="top-site-info">
                            <p className="top-site-title">{new URL(site.url).hostname}</p>
                            <p className="top-site-url">{site.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};