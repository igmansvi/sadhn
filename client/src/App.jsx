import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import LoadingState from "@/components/shared/LoadingState";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import GuestRoute from "@/components/shared/GuestRoute";

const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const LearnerLayout = lazy(() => import("@/layouts/LearnerLayout"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

const HomePage = lazy(() => import("@/pages/common/HomePage"));
const PublicJobsPage = lazy(() => import("@/pages/common/JobsPage"));
const PublicJobDetailPage = lazy(() => import("@/pages/common/JobDetailPage"));
const PublicArticlesPage = lazy(() => import("@/pages/common/ArticlesPage"));
const PublicArticleDetailPage = lazy(() => import("@/pages/common/ArticleDetailPage"));
const PublicProgramsPage = lazy(() => import("@/pages/common/ProgramsPage"));
const PublicProgramDetailPage = lazy(() => import("@/pages/common/ProgramDetailPage"));

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));
const VerifyEmailNoticePage = lazy(() => import("@/pages/auth/VerifyEmailNoticePage"));

const OnboardingPage = lazy(() => import("@/pages/learner/OnboardingPage"));
const LearnerExplorePage = lazy(() => import("@/pages/learner/ExplorePage"));
const LearnerJobsPage = lazy(() => import("@/pages/learner/JobsPage"));
const LearnerJobDetailPage = lazy(() => import("@/pages/learner/JobDetailPage"));
const LearnerApplicationsPage = lazy(() => import("@/pages/learner/ApplicationsPage"));
const LearnerProgramsPage = lazy(() => import("@/pages/learner/ProgramsPage"));
const LearnerProfilePage = lazy(() => import("@/pages/learner/ProfilePage"));

const EmployerDashboardPage = lazy(() => import("@/pages/employer/DashboardPage"));
const EmployerJobsPage = lazy(() => import("@/pages/employer/JobsPage"));
const EmployerJobFormPage = lazy(() => import("@/pages/employer/JobFormPage"));
const EmployerApplicationsPage = lazy(() => import("@/pages/employer/ApplicationsPage"));
const EmployerArticlesPage = lazy(() => import("@/pages/employer/ArticlesPage"));
const EmployerArticleFormPage = lazy(() => import("@/pages/employer/ArticleFormPage"));
const EmployerProfilePage = lazy(() => import("@/pages/employer/ProfilePage"));

const AdminDashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminNewsPage = lazy(() => import("@/pages/admin/NewsPage"));
const AdminProgramsPage = lazy(() => import("@/pages/admin/ProgramsPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/UsersPage"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState fullScreen />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<PublicJobsPage />} />
            <Route path="/jobs/:id" element={<PublicJobDetailPage />} />
            <Route path="/articles" element={<PublicArticlesPage />} />
            <Route path="/articles/:id" element={<PublicArticleDetailPage />} />
            <Route path="/programs" element={<PublicProgramsPage />} />
            <Route path="/programs/:id" element={<PublicProgramDetailPage />} />
          </Route>

          <Route element={<GuestRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/verify-email-notice" element={<VerifyEmailNoticePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["learner"]} requireProfile={false} />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["learner"]} requireProfile={true} />}>
            <Route element={<LearnerLayout />}>
              <Route path="/learner/explore" element={<LearnerExplorePage />} />
              <Route path="/learner/jobs" element={<LearnerJobsPage />} />
              <Route path="/learner/jobs/:id" element={<LearnerJobDetailPage />} />
              <Route path="/learner/applications" element={<LearnerApplicationsPage />} />
              <Route path="/learner/programs" element={<LearnerProgramsPage />} />
              <Route path="/learner/profile" element={<LearnerProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["employer"]} requireProfile={false} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/employer" element={<EmployerDashboardPage />} />
              <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
              <Route path="/employer/jobs" element={<EmployerJobsPage />} />
              <Route path="/employer/jobs/new" element={<EmployerJobFormPage />} />
              <Route path="/employer/jobs/:id/edit" element={<EmployerJobFormPage />} />
              <Route path="/employer/applications" element={<EmployerApplicationsPage />} />
              <Route path="/employer/jobs/:jobId/applications" element={<EmployerApplicationsPage />} />
              <Route path="/employer/articles" element={<EmployerArticlesPage />} />
              <Route path="/employer/articles/new" element={<EmployerArticleFormPage />} />
              <Route path="/employer/articles/:id/edit" element={<EmployerArticleFormPage />} />
              <Route path="/employer/profile" element={<EmployerProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} requireProfile={false} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/news" element={<AdminNewsPage />} />
              <Route path="/admin/programs" element={<AdminProgramsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}