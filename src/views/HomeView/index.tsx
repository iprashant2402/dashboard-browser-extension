import Clock from "../../components/Clock/Clock";
import { Layout } from "../../components/Layout";
import { MascotContainer } from "../../components/Mascot";
import { TaskBoardView } from "../TaskBoardView";

export const HomeView = () => {

    return (
        <Layout>
            <div className="row">
                <Clock />
            </div>
            <div className="row jt-center">
                <MascotContainer />
            </div>
            <TaskBoardView />
        </Layout>
    )
}

export default HomeView;  