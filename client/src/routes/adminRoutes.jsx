import { lazy } from "react";

const AdminDashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminNewsPage = lazy(() => import("@/pages/admin/NewsPage"));
const AdminProgramsPage = lazy(() => import("@/pages/admin/ProgramsPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/UsersPage"));
const AdminContactPage = lazy(() => import("@/pages/admin/ContactPage"));

export const adminRoutes = [
    {
        path: "/admin",
        element: <AdminDashboardPage />,
    },
    {
        path: "/admin/dashboard",
        element: <AdminDashboardPage />,
    },
    {
        path: "/admin/news",
        element: <AdminNewsPage />,
    },
    {
        path: "/admin/programs",
        element: <AdminProgramsPage />,
    },
    {
        path: "/admin/users",
        element: <AdminUsersPage />,
    },
    {
        path: "/admin/contacts",
        element: <AdminContactPage />,
    },
];

export default adminRoutes;
