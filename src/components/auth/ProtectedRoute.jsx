import { jsx } from "react/jsx-runtime";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectIsAuthenticated } from "../../features/auth/authSlice";
function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true, state: { from: location.pathname } });
  }
  return /* @__PURE__ */ jsx(Outlet, {});
}
export {
  ProtectedRoute
};
