import { useCallback, useEffect, useState } from "react";
import topSitesMock from "./topSitesMock.json";

interface TopSite extends chrome.topSites.MostVisitedURL {
    favicon: string;
}

export const useTopSites = () => {
    const [topSites, setTopSites] = useState<TopSite[]>(topSitesMock);

    const fetchTopSites = useCallback(async () => {
        const topSites = await chrome?.topSites?.get();
        if (topSites && topSites.length > 0) {
            const topSitesWithFavicon = topSites.map((site) => {
                const baseUrl = new URL(site.url).origin;
                return {
                    ...site,
                    favicon: `${baseUrl}/favicon.ico`,
                };
            });
            setTopSites(topSitesWithFavicon);
        }
    }, []);

    useEffect(() => {
        fetchTopSites();
    }, [fetchTopSites]);

    return {
        topSites,
    };
};