import { jsx, jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleRoute } from "./components/auth/RoleRoute";
import { AppShell } from "./components/layout/AppShell";
import { ActivitiesPage } from "./pages/ActivitiesPage";
import { CustomerDetailPage } from "./pages/CustomerDetailPage";
import { CustomersPage } from "./pages/CustomersPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LeadsPage } from "./pages/LeadsPage";
import { LoginPage } from "./pages/LoginPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { OtpVerificationPage } from "./pages/OtpVerificationPage";
import { PipelinePage } from "./pages/PipelinePage";
import { ProfileSettingsPage } from "./pages/ProfileSettingsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SignupPage } from "./pages/SignupPage";
import { TasksPage } from "./pages/TasksPage";
function App() {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/signup", element: /* @__PURE__ */ jsx(SignupPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/forgot-password", element: /* @__PURE__ */ jsx(ForgotPasswordPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/verify-otp", element: /* @__PURE__ */ jsx(OtpVerificationPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/reset-password", element: /* @__PURE__ */ jsx(ResetPasswordPage, {}) }),
    /* @__PURE__ */ jsx(Route, { element: /* @__PURE__ */ jsx(ProtectedRoute, {}), children: /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(AppShell, {}), children: [
      /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(RoleRoute, {}), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(DashboardPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "leads", element: /* @__PURE__ */ jsx(LeadsPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "pipeline", element: /* @__PURE__ */ jsx(PipelinePage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "customers", element: /* @__PURE__ */ jsx(CustomersPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "customers/:id", element: /* @__PURE__ */ jsx(CustomerDetailPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "tasks", element: /* @__PURE__ */ jsx(TasksPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "activities", element: /* @__PURE__ */ jsx(ActivitiesPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "reports", element: /* @__PURE__ */ jsx(ReportsPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "notifications", element: /* @__PURE__ */ jsx(NotificationsPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "profile", element: /* @__PURE__ */ jsx(ProfileSettingsPage, {}) })
      ] }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
    ] }) })
  ] });
}
export {
  App as default
};
