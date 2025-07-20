import "./index.css";
import { Layout } from "../../components/Layout";
import { CommandCenter } from "../CommandCenter";
import { NotebookList } from "../../modules/Notes/components/NotebookList";
import { PreferencesToolbar } from "../../modules/UserPreferences/components/PreferencesToolbar";
import { EditorTabsProvider } from "../../modules/Notes/components/EditorTabsProvider";
import Clock from "../../components/Clock/Clock";
import { GameSelector } from "../../components/GameSelector";

export const HomeView = () => {

    return (
        <Layout>
            <div className="row home-view">
                <div className="column panel-col notes-list-panel">
                    <NotebookList />
                </div>
                <div className="column panel-col command-center-container">
                    <EditorTabsProvider>
                        <CommandCenter />
                    </EditorTabsProvider>
                </div>
                <div className="column panel-col">
                    <div className="column project-list-panel">
                        <Clock />
                        <GameSelector />
                    </div>
                    <div className="footer-bar">
                        <PreferencesToolbar />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomeView;  