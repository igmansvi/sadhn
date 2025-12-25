import { lazy } from "react";

const EmployerDashboardPage = lazy(() => import("@/pages/employer/DashboardPage"));
const EmployerJobsPage = lazy(() => import("@/pages/employer/JobsPage"));
const EmployerJobFormPage = lazy(() => import("@/pages/employer/JobFormPage"));
const EmployerApplicationsPage = lazy(() => import("@/pages/employer/ApplicationsPage"));
const EmployerArticlesPage = lazy(() => import("@/pages/employer/ArticlesPage"));
const EmployerArticleFormPage = lazy(() => import("@/pages/employer/ArticleFormPage"));
const EmployerProfilePage = lazy(() => import("@/pages/employer/ProfilePage"));

export const employerRoutes = [
    {
        path: "/employer",
        element: <EmployerDashboardPage />,
    },
    {
        path: "/employer/dashboard",
        element: <EmployerDashboardPage />,
    },
    {
        path: "/employer/jobs",
        element: <EmployerJobsPage />,
    },
    {
        path: "/employer/jobs/new",
        element: <EmployerJobFormPage />,
    },
    {
        path: "/employer/jobs/:id/edit",
        element: <EmployerJobFormPage />,
    },
    {
        path: "/employer/applications",
        element: <EmployerApplicationsPage />,
    },
    {
        path: "/employer/jobs/:jobId/applications",
        element: <EmployerApplicationsPage />,
    },
    {
        path: "/employer/articles",
        element: <EmployerArticlesPage />,
    },
    {
        path: "/employer/articles/new",
        element: <EmployerArticleFormPage />,
    },
    {
        path: "/employer/articles/:id/edit",
        element: <EmployerArticleFormPage />,
    },
    {
        path: "/employer/profile",
        element: <EmployerProfilePage />,
    },
];

export default employerRoutes;
