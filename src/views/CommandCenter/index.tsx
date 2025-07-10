import "./index.css";
import { Outlet } from "react-router";

export const CommandCenter = () => {

    return <div className="command-center">
        <div className="command-center-content">
            <Outlet />
        </div>
    </div>;
}