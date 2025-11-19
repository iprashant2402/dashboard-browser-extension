import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./modules/Auth";
import { useEffect } from "react";
import { ACCESS_TOKEN_KEY } from "./modules/Notes/utils/contants";

export const AppManager = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
        if (user?.id || isAuthenticated) {
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/notebook')) {
                navigate("/notebook");
            }
        } else {
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/auth')) {
                navigate("/auth");
            }
        }
    }, [user, navigate]);

    return (
        <Outlet />
    );
};