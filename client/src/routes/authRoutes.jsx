import { lazy } from "react";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const ResetPasswordNoticePage = lazy(() => import("@/pages/auth/ResetPasswordNoticePage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));
const VerifyEmailNoticePage = lazy(() => import("@/pages/auth/VerifyEmailNoticePage"));

export const authRoutes = [
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
    },
];

export const publicAuthRoutes = [
    {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
    },
    {
        path: "/reset-password-notice",
        element: <ResetPasswordNoticePage />,
    },
    {
        path: "/verify-email/:token",
        element: <VerifyEmailPage />,
    },
    {
        path: "/verify-email-notice",
        element: <VerifyEmailNoticePage />,
    },
];

export default authRoutes;
