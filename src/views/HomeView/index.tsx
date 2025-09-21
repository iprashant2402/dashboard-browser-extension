import "./index.css";
import { Layout } from "../../components/Layout";
import { CommandCenter } from "../CommandCenter";
import { NotebookList } from "../../modules/Notes/components/NotebookList";
import { usePrivacyCurtain } from "../../providers/PrivacyCurtainProvider";
import { Sidebar } from "../../components/Sidebar";
import { NotebookListHeader } from "../../modules/Notes/components/NotebookList/NotebookListHeader";
import { useEffect } from "react";
import { useBatchSync } from "../../modules/Notes/hooks/useBatchSync";
import { IoIosEye, IoIosEyeOff, IoIosHome, IoIosSettings } from "react-icons/io";
import { AnalyticsTracker } from "../../analytics/AnalyticsTracker";
import { PrivacyCurtain } from "../../modules/UserPreferences/components/PrivacyCurtain/PrivacyCurtain";
import { BottomTabBar } from "../../components/BottomNavBar";
import { useMediaQuery } from "react-responsive";

const TABS = [
    {
        label: 'Home',
        icon: <IoIosHome />,
        path: '/home',
    },
    {
        label: 'Settings',
        icon: <IoIosSettings />,
        path: '/preferences',
    }
]

export const HomeView = () => {
    const { isPrivacyCurtainEnabled, setIsPrivacyCurtainEnabled } = usePrivacyCurtain();
    const { mutateAsync: batchSync } = useBatchSync();
    const isMobileView = useMediaQuery({ maxWidth: 1024 });

    useEffect(() => {
        const interval = setInterval(() => {
            batchSync();
        }, 30_000);
        return () => clearInterval(interval);

    }, [batchSync])

    const togglePrivacyCurtain = () => {
        AnalyticsTracker.track('Privacy Curtain - Click', {
            old_value: isPrivacyCurtainEnabled,
            new_value: !isPrivacyCurtainEnabled,
        });
        setIsPrivacyCurtainEnabled(!isPrivacyCurtainEnabled);
    }

    return (
        <>
        {!isMobileView && <Layout className="desktop-layout" sidebar={<Sidebar header={<NotebookListHeader />}>
            <NotebookList />
        </Sidebar>}>
            {isPrivacyCurtainEnabled && (
                <PrivacyCurtain />
                )}
                    <div className="row home-view">
                    <div className="column panel-col command-center-container">
                            <CommandCenter />
                    </div>
            </div>
            <span className="privacy-curtain-toggle" onClick={togglePrivacyCurtain}>
                {!isPrivacyCurtainEnabled ? <IoIosEyeOff size={16} /> : <IoIosEye size={16} />}
                <p>{isPrivacyCurtainEnabled ? 'Reveal' : 'Hide'}</p>
            </span>
        </Layout>}
        {isMobileView &&<Layout className="mobile-layout">
            <CommandCenter />
            <BottomTabBar tabs={TABS} />
        </Layout>}
        </>
    )
}

export default HomeView;  