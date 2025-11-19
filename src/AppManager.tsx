import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./modules/Auth";
import { useEffect } from "react";
import { ACCESS_TOKEN_KEY } from "./modules/Notes/utils/contants";

export const AppManager = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
        if (user?.id && isAuthenticated) {
            navigate("/notebook");
        } else {
            navigate("/auth");
        }
    }, [user, navigate]);

    return (
        <Outlet />
    );
};