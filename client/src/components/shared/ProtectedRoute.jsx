import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { profileService } from "@/lib/services/profileService";
import LoadingState from "./LoadingState";

export default function ProtectedRoute({ children, allowedRoles = [], requireProfile = false }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const location = useLocation();
    const [checking, setChecking] = useState(true);
    const [hasProfile, setHasProfile] = useState(false);

    useEffect(() => {
        const checkProfile = async () => {
            if (!requireProfile) {
                setChecking(false);
                setHasProfile(true);
                return;
            }

            if (profile) {
                setChecking(false);
                setHasProfile(true);
                return;
            }

            if (user?.role !== "learner") {
                setChecking(false);
                setHasProfile(true);
                return;
            }

            try {
                const response = await profileService.checkProfileExists();
                setHasProfile(response.exists);
            } catch {
                setHasProfile(false);
            } finally {
                setChecking(false);
            }
        };

        if (isAuthenticated) {
            checkProfile();
        } else {
            setChecking(false);
        }
    }, [isAuthenticated, requireProfile, profile, user?.role]);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        const redirectPath = user?.role === "admin"
            ? "/admin/dashboard"
            : user?.role === "employer"
                ? "/employer/dashboard"
                : "/learner/explore";
        return <Navigate to={redirectPath} replace />;
    }

    if (checking) {
        return <LoadingState fullScreen />;
    }

    if (requireProfile && !hasProfile && user?.role === "learner") {
        return <Navigate to="/onboarding" replace />;
    }

    return children || <Outlet />;
}
