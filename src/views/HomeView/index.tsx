import "./index.css";
import { Layout } from "../../components/Layout";
import { CommandCenter } from "../../components/CommandCenter";
import { NotebookList } from "../../components/NotebookList";
import { ProjectList } from "../../modules/Tasks/components/ProjectList/ProjectList";
import { PreferencesToolbar } from "../../modules/UserPreferences/components/PreferencesToolbar";

export const HomeView = () => {

    return (
        <Layout>
            <div className="row home-view">
                <div className="column panel-col notes-list-panel">
                    <NotebookList />
                </div>
                <div className="column panel-col command-center-container">
                    <CommandCenter />
                </div>
                <div className="column panel-col">
                    <div className="column project-list-panel">
                        <ProjectList />
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