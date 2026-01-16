import { lazy } from "react";
import { Navigate } from "react-router-dom";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import GuestRoute from "@/components/shared/GuestRoute";

import { publicRoutes } from "./publicRoutes";
import { authRoutes, publicAuthRoutes } from "./authRoutes";
import { learnerRoutes, onboardingRoutes } from "./learnerRoutes";
import { employerRoutes } from "./employerRoutes";
import { adminRoutes } from "./adminRoutes";

const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const LearnerLayout = lazy(() => import("@/layouts/LearnerLayout"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

export const routes = [
    {
        element: <MainLayout />,
        children: publicRoutes,
    },
    {
        element: <GuestRoute />,
        children: [
            {
                element: <AuthLayout />,
                children: authRoutes,
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: publicAuthRoutes,
    },
    {
        element: <ProtectedRoute allowedRoles={["learner"]} requireProfile={false} />,
        children: onboardingRoutes,
    },
    {
        element: <ProtectedRoute allowedRoles={["learner"]} requireProfile={true} />,
        children: [
            {
                element: <LearnerLayout />,
                children: learnerRoutes,
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={["employer"]} requireProfile={false} />,
        children: [
            {
                element: <DashboardLayout />,
                children: employerRoutes,
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={["admin"]} requireProfile={false} />,
        children: [
            {
                element: <AdminLayout />,
                children: adminRoutes,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
];

export default routes;
