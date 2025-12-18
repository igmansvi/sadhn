import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function GuestRoute({ children }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isAuthenticated) {
        const from = location.state?.from?.pathname;
        if (from) {
            return <Navigate to={from} replace />;
        }

        const redirectPath = user?.role === "admin"
            ? "/admin/dashboard"
            : user?.role === "employer"
                ? "/employer/dashboard"
                : "/learner/explore";
        return <Navigate to={redirectPath} replace />;
    }

    return children || <Outlet />;
}
