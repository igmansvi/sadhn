import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/common/HomePage"));
const PublicJobsPage = lazy(() => import("@/pages/common/JobsPage"));
const PublicJobDetailPage = lazy(() => import("@/pages/common/JobDetailPage"));
const PublicArticlesPage = lazy(() => import("@/pages/common/ArticlesPage"));
const PublicArticleDetailPage = lazy(() => import("@/pages/common/ArticleDetailPage"));
const PublicProgramsPage = lazy(() => import("@/pages/common/ProgramsPage"));
const PublicProgramDetailPage = lazy(() => import("@/pages/common/ProgramDetailPage"));
const AboutPage = lazy(() => import("@/pages/common/AboutPage"));
const ContactPage = lazy(() => import("@/pages/common/ContactPage"));

export const publicRoutes = [
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/about",
        element: <AboutPage />,
    },
    {
        path: "/contact",
        element: <ContactPage />,
    },
    {
        path: "/jobs",
        element: <PublicJobsPage />,
    },
    {
        path: "/jobs/:id",
        element: <PublicJobDetailPage />,
    },
    {
        path: "/articles",
        element: <PublicArticlesPage />,
    },
    {
        path: "/articles/:id",
        element: <PublicArticleDetailPage />,
    },
    {
        path: "/programs",
        element: <PublicProgramsPage />,
    },
    {
        path: "/programs/:id",
        element: <PublicProgramDetailPage />,
    },
];

export default publicRoutes;
