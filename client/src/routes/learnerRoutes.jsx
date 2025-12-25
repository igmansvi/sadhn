import { lazy } from "react";

const OnboardingPage = lazy(() => import("@/pages/learner/OnboardingPage"));
const LearnerExplorePage = lazy(() => import("@/pages/learner/ExplorePage"));
const LearnerJobsPage = lazy(() => import("@/pages/learner/JobsPage"));
const LearnerJobDetailPage = lazy(() => import("@/pages/learner/JobDetailPage"));
const LearnerApplicationsPage = lazy(() => import("@/pages/learner/ApplicationsPage"));
const LearnerProgramsPage = lazy(() => import("@/pages/learner/ProgramsPage"));
const LearnerProfilePage = lazy(() => import("@/pages/learner/ProfilePage"));

export const onboardingRoutes = [
    {
        path: "/onboarding",
        element: <OnboardingPage />,
    },
];

export const learnerRoutes = [
    {
        path: "/learner/explore",
        element: <LearnerExplorePage />,
    },
    {
        path: "/learner/jobs",
        element: <LearnerJobsPage />,
    },
    {
        path: "/learner/jobs/:id",
        element: <LearnerJobDetailPage />,
    },
    {
        path: "/learner/applications",
        element: <LearnerApplicationsPage />,
    },
    {
        path: "/learner/programs",
        element: <LearnerProgramsPage />,
    },
    {
        path: "/learner/profile",
        element: <LearnerProfilePage />,
    },
];

export default learnerRoutes;
