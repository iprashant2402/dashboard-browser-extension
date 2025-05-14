import "./index.css";
import { Layout } from "../../components/Layout";
import { CommandCenter } from "../../components/CommandCenter";
import { ProjectList } from "../../components/ProjectList";
import { NotebookList } from "../../components/NotebookList";

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
                <div className="column panel-col project-list-panel">
                    <ProjectList />
                </div>
            </div>
        </Layout>
    )
}

export default HomeView;  