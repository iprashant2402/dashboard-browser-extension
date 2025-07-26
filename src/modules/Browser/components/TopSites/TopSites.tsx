import './TopSites.css';
import { useTopSites } from "../../hooks/useTopSites";

export const TopSites = () => {
    const { topSites } = useTopSites();

    return <div className="top-sites-container">
        {topSites.map((site) => (
            <div key={site.url} className="top-site-item">
                <img src={site.favicon} alt={site.title} />
                <p>{site.title}</p>
            </div>
        ))}
    </div>;
};