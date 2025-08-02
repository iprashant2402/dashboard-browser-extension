import "./index.css";
import { Layout } from "../../components/Layout";
import { CommandCenter } from "../CommandCenter";
import { NotebookList } from "../../modules/Notes/components/NotebookList";
import { PreferencesToolbar } from "../../modules/UserPreferences/components/PreferencesToolbar";
import { EditorTabsProvider } from "../../modules/Notes/components/EditorTabsProvider";
import { ResponsiveTabs } from "../../components/ResponsiveTabs";
import { usePrivacyCurtain } from "../../providers/PrivacyCurtainProvider";
import Clock from "../../components/Clock/Clock";

export const HomeView = () => {
    const { isPrivacyCurtainEnabled, setIsPrivacyCurtainEnabled } = usePrivacyCurtain();

    const togglePrivacyCurtain = () => {
        setIsPrivacyCurtainEnabled(!isPrivacyCurtainEnabled);
    }

    return (
        <Layout>
            {isPrivacyCurtainEnabled && (
                    <div className="privacy-curtain">
                        <Clock />
                    </div>
                )}
                    <div className="row home-view">
                {/* Desktop Layout - Hidden on mobile/tablet */}
                <div className="desktop-layout">
                    <div className="column panel-col">
                    <div className="column notes-list-panel">
                        <NotebookList />
                    </div>
                    </div>
                    <div className="column panel-col command-center-container">
                        <EditorTabsProvider>
                            <CommandCenter />
                        </EditorTabsProvider>
                    </div>
                </div>

                {/* Mobile/Tablet Layout - Hidden on desktop */}
                <div className="mobile-layout">
                    <ResponsiveTabs />
                    <div className="mobile-footer-bar">
                        <PreferencesToolbar />
                    </div>
                </div>
            </div>
            <span className="privacy-curtain-toggle">
                <p onClick={togglePrivacyCurtain}>{isPrivacyCurtainEnabled ? 'Reveal' : 'Hide'}</p>
            </span>
            <div className="footer-bar">
                <PreferencesToolbar />
            </div>
        </Layout>
    )
}

export default HomeView;  