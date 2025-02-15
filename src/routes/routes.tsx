import { BrowserRouter, Route, Routes } from "react-router";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import LogsPage from "@/views/pages/auth/general/logs/logs-page";
import ErrorPage from "@/views/pages/error/error-page";
import ForgotPasswordPage from "@/views/pages/guest/password/forgot-password-page";
import MainPage from "@/views/site/main-page";
import HomePage from "@/views/site/tabs/home/home-page";
import AboutPage from "@/views/site/tabs/about/about-page";
import SiteLayout from "@/views/layout/site-layout";
import SuperAuditPage from "@/views/pages/auth/super/audit/super-audit-page";
import SuperUserEditPage from "@/views/pages/auth/general/users/edit/super-user-edit-page";
import { Donor, Ngo, User, UserPermission } from "@/database/tables";
import ProtectedRoute from "@/routes/protected-route";
import Unauthorized from "@/views/pages/error/unauthorized";
import GuestLayout from "@/views/layout/guest-layout";
import AuthLayout from "@/views/layout/auth-layout";
import UserDashboardPage from "@/views/pages/auth/user/dashboard/user-dashboard-page";
import UserReportsPage from "@/views/pages/auth/user/reports/user-reports-page";
import SuperReportsPage from "@/views/pages/auth/general/reports/super-reports-page";
import SuperUserPage from "@/views/pages/auth/general/users/super-user-page";
import DebuggerDashboardPage from "@/views/pages/auth/debugger/dashboard/debugger-dashboard-page";
import NgosPage from "@/views/site/tabs/ngos/ngos-page";
import NewsPage from "@/views/site/tabs/news/news-page";
import DonorDashboardPage from "@/views/pages/auth/donor/dashboard/donor-dashboard-page";
import DonorNgoPage from "@/views/pages/auth/donor/ngo/donor-ngo-page";
import DonorReportsPage from "@/views/pages/auth/donor/reports/donor-reports-page";
import NgoDashboardPage from "@/views/pages/auth/ngo/dashboard/ngo-dashboard-page";
import NgoProjectsPage from "@/views/pages/auth/ngo/projects/ngo-projects-page";
import NgoReportsPage from "@/views/pages/auth/ngo/reports/ngo-reports-page";
import UserNgoPage from "@/views/pages/auth/user/ngo/user-ngo-page";
import ProjectsPage from "@/views/pages/auth/general/projects/projects-page";
import SuperDashboardPage from "@/views/pages/auth/super/dashboard/super-dashboard-page";
import AdminDashboardPage from "@/views/pages/auth/admin/dashboard/admin-dashboard-page";
import DonorProjectsPage from "@/views/pages/auth/donor/projects/donor-projects-page";
import UserDonorPage from "@/views/pages/auth/user/donor/user-donor-page";
import NewsManagementPage from "@/views/pages/auth/general/management/news/news-management-page";
import UserNgoEditPage from "@/views/pages/auth/user/ngo/edit/user-ngo-edit-page";
import UserLoginPage from "@/views/pages/guest/users/user-login-page";
import DonorLoginPage from "@/views/pages/guest/donor/donor-login-page";
import NgoLoginPage from "@/views/pages/guest/ngo/ngo-login-page";
import UsersProfilePage from "@/views/pages/auth/general/profile/users/users-profile-page";
import NgoProfilePage from "@/views/pages/auth/general/profile/ngo/ngo-profile-page";
import DonorProfilePage from "@/views/pages/auth/general/profile/donor/donor-profile-page";
import LoginPage from "@/views/pages/guest/login-page";
import EditNews from "@/views/pages/auth/general/management/news/edit/edite-news";
import AboutManagementPage from "@/views/pages/auth/general/management/about/about-management-page";
import ViewNewsItem from "@/views/site/tabs/news/view-news-item";
import EditNgoProgress from "@/views/pages/auth/general/ngo/edit-ngo-progress";
import ErrorLayout from "@/views/layout/error-layout";
import SettingsPage from "@/views/pages/auth/general/settings/settings-page";

export const getSuperRouter = (user: User | Ngo | Donor) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Error Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <ErrorLayout />
            </I18nextProvider>
          }
        >
          {error}
        </Route>
        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>

        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<SuperDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<SuperUserPage />}
                routeName="users"
                permissions={permissions}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute
                element={<SuperUserEditPage />}
                routeName="users"
                permissions={permissions}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<SuperReportsPage />}
                routeName="reports"
                permissions={permissions}
              />
            }
          />
          <Route path="profile" element={<UsersProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
              />
            }
          />
          <Route
            path="audit"
            element={
              <ProtectedRoute
                element={<SuperAuditPage />}
                routeName="audit"
                permissions={permissions}
              />
            }
          />
          <Route
            path="logs"
            element={
              <ProtectedRoute
                element={<LogsPage />}
                routeName="logs"
                permissions={permissions}
              />
            }
          />
          <Route
            path="ngo"
            element={
              <ProtectedRoute
                element={<UserNgoPage />}
                routeName="ngo"
                permissions={permissions}
              />
            }
          />
          <Route
            path="ngo/:id"
            element={
              <ProtectedRoute
                element={<UserNgoEditPage />}
                routeName="ngo"
                permissions={permissions}
              />
            }
          />
          <Route
            path="ngo/profile/edit/:id"
            element={
              <ProtectedRoute
                element={<EditNgoProgress />}
                routeName="ngo"
                permissions={permissions}
              />
            }
          />
          <Route
            path="donor"
            element={
              <ProtectedRoute
                element={<UserDonorPage />}
                routeName="donor"
                permissions={permissions}
              />
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute
                element={<ProjectsPage />}
                routeName="projects"
                permissions={permissions}
              />
            }
          />
          <Route
            path="management/news"
            element={
              <ProtectedRoute
                element={<NewsManagementPage />}
                routeName="management/news"
                permissions={permissions}
              />
            }
          />
          <Route
            path="management/news/:id"
            element={
              <ProtectedRoute
                element={<EditNews />}
                routeName="management/news"
                permissions={permissions}
              />
            }
          />
          <Route
            path="management/about"
            element={
              <ProtectedRoute
                element={<AboutManagementPage />}
                routeName="management/about"
                permissions={permissions}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export const getAdminRouter = (user: User | Ngo | Donor) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Error Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <ErrorLayout />
            </I18nextProvider>
          }
        >
          {error}
        </Route>
        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>

        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<AdminDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<SuperUserPage />}
                routeName="users"
                permissions={permissions}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute
                element={<SuperUserEditPage />}
                routeName="users"
                permissions={permissions}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<SuperReportsPage />}
                routeName="reports"
                permissions={permissions}
              />
            }
          />
          <Route path="profile" element={<UsersProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
              />
            }
          />
          <Route
            path="ngo"
            element={
              <ProtectedRoute
                element={<UserNgoPage />}
                routeName="ngo"
                permissions={permissions}
              />
            }
          />
          <Route
            path="ngo/profile/edit/:id"
            element={
              <ProtectedRoute
                element={<EditNgoProgress />}
                routeName="ngo"
                permissions={permissions}
              />
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute
                element={<ProjectsPage />}
                routeName="projects"
                permissions={permissions}
              />
            }
          />
          <Route
            path="management/news"
            element={
              <ProtectedRoute
                element={<NewsManagementPage />}
                routeName="management/news"
                permissions={permissions}
              />
            }
          />
          <Route
            path="management/news/:id"
            element={
              <ProtectedRoute
                element={<EditNews />}
                routeName="management/news"
                permissions={permissions}
              />
            }
          />
          <Route
            path="management/about"
            element={
              <ProtectedRoute
                element={<AboutManagementPage />}
                routeName="management/about"
                permissions={permissions}
              />
            }
          />
        </Route>

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getUserRouter = (user: User | Ngo | Donor) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Error Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <ErrorLayout />
            </I18nextProvider>
          }
        >
          {error}
        </Route>
        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>

        {/* User Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<UserDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<UserReportsPage />}
                routeName="reports"
                permissions={permissions}
              />
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
              />
            }
          />
          <Route path="profile" element={<UsersProfilePage />} />
          <Route
            path="ngo"
            element={
              <ProtectedRoute
                element={<UserNgoPage />}
                routeName="ngo"
                permissions={permissions}
              />
            }
          />
          <Route
            path="ngo/profile/edit/:id"
            element={
              <ProtectedRoute
                element={<EditNgoProgress />}
                routeName="ngo"
                permissions={permissions}
              />
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute
                element={<ProjectsPage />}
                routeName="projects"
                permissions={permissions}
              />
            }
          />
          <Route
            path="management/news"
            element={
              <ProtectedRoute
                element={<NewsManagementPage />}
                routeName="management/news"
                permissions={permissions}
              />
            }
          />
          <Route
            path="management/news/:id"
            element={
              <ProtectedRoute
                element={<EditNews />}
                routeName="management/news"
                permissions={permissions}
              />
            }
          />
          <Route
            path="management/about"
            element={
              <ProtectedRoute
                element={<AboutManagementPage />}
                routeName="management/about"
                permissions={permissions}
              />
            }
          />
        </Route>

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getDebuggerRouter = (user: User | Ngo | Donor) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Error Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <ErrorLayout />
            </I18nextProvider>
          }
        >
          {error}
        </Route>
        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>

        {/* User Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<DebuggerDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
          <Route
            path="logs"
            element={
              <ProtectedRoute
                element={<LogsPage />}
                routeName="logs"
                permissions={permissions}
              />
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
              />
            }
          />
          <Route path="profile" element={<UsersProfilePage />} />
        </Route>

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getGuestRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Error Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <ErrorLayout />
            </I18nextProvider>
          }
        >
          {error}
        </Route>
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <GuestLayout />
            </I18nextProvider>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/login" element={<UserLoginPage />} />
          <Route path="/donor/login" element={<DonorLoginPage />} />
          <Route path="/ngo/login" element={<NgoLoginPage />} />
          <Route path="/forget-password" element={<ForgotPasswordPage />} />
        </Route>
        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getNgoRouter = (user: User | Ngo | Donor) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Error Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <ErrorLayout />
            </I18nextProvider>
          }
        >
          {error}
        </Route>
        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>

        {/* User Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<NgoDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute
                element={<NgoProjectsPage />}
                routeName="projects"
                permissions={permissions}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<NgoReportsPage />}
                routeName="reports"
                permissions={permissions}
              />
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
              />
            }
          />
          <Route path="profile" element={<NgoProfilePage />} />
        </Route>

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getDonorRouter = (user: User | Ngo | Donor) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Error Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <ErrorLayout />
            </I18nextProvider>
          }
        >
          {error}
        </Route>
        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>

        {/* User Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<DonorDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
          <Route
            path="ngo"
            element={
              <ProtectedRoute
                element={<DonorNgoPage />}
                routeName="ngo"
                permissions={permissions}
              />
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute
                element={<DonorProjectsPage />}
                routeName="projects"
                permissions={permissions}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<DonorReportsPage />}
                routeName="reports"
                permissions={permissions}
              />
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
              />
            }
          />
          <Route path="profile" element={<DonorProfilePage />} />
        </Route>

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

const site = (
  <Route path="/" element={<MainPage />}>
    <Route index element={<HomePage />} />
    {/* Default route (equivalent to `/`) */}
    <Route path="home" element={<HomePage />} />
    <Route path="ngos" element={<NgosPage />} />
    <Route path="news" element={<NewsPage />} />
    <Route path="news/:id" element={<ViewNewsItem />} />
    <Route path="about" element={<AboutPage />} />
    {/* Catch-all Route for Errors */}
    <Route path="*" element={<HomePage />} />
    {/* Fallback for unknown routes */}
  </Route>
);
const error = <Route path="/unauthorized" element={<Unauthorized />}></Route>;
