import "./index.css";
import { Layout } from "../../components/Layout";
import { CommandCenter } from "../CommandCenter";
import { NotebookList } from "../../modules/Notes/components/NotebookList";
import { usePrivacyCurtain } from "../../providers/PrivacyCurtainProvider";
import Clock from "../../components/Clock/Clock";
import { Sidebar } from "../../components/Sidebar";
import { NotebookListHeader } from "../../modules/Notes/components/NotebookList/NotebookListHeader";
import { useEffect } from "react";
import { useBatchSync } from "../../modules/Notes/hooks/useBatchSync";

export const HomeView = () => {
    const { isPrivacyCurtainEnabled, setIsPrivacyCurtainEnabled } = usePrivacyCurtain();
    const { mutateAsync: batchSync } = useBatchSync();

    useEffect(() => {
        const interval = setInterval(() => {
            batchSync();
        }, 30_000);
        return () => clearInterval(interval);

    }, [batchSync])

    const togglePrivacyCurtain = () => {
        setIsPrivacyCurtainEnabled(!isPrivacyCurtainEnabled);
    }

    return (
        <Layout sidebar={<Sidebar header={<NotebookListHeader />}>
            <NotebookList />
        </Sidebar>}>
            {isPrivacyCurtainEnabled && (
                    <div className="privacy-curtain">
                        <Clock />
                    </div>
                )}
                    <div className="row home-view">
                    <div className="column panel-col command-center-container">
                            <CommandCenter />
                    </div>
            </div>
            <span className="privacy-curtain-toggle">
                <p onClick={togglePrivacyCurtain}>{isPrivacyCurtainEnabled ? 'Reveal' : 'Hide'}</p>
            </span>
        </Layout>
    )
}

export default HomeView;  