import { jsx } from "react/jsx-runtime";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../features/auth/authSlice";
import { canAccessModule, moduleFromPath } from "../../lib/permissions";
function RoleRoute() {
  const user = useAppSelector(selectAuthUser);
  const location = useLocation();
  const module = moduleFromPath(location.pathname);
  if (module && !canAccessModule(user?.userRole ?? user?.role, module)) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  }
  return /* @__PURE__ */ jsx(Outlet, {});
}
export {
  RoleRoute
};
