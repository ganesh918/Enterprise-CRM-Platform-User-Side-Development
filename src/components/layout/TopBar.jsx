import { jsx, jsxs } from "react/jsx-runtime";
import { Bell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  logout,
  selectAuthUser,
  selectCurrentTeamMemberId
} from "../../features/auth/authSlice";
import { selectUnreadCount } from "../../features/notifications/notificationsSlice";
import { hasFullTeamDataView } from "../../lib/userScope";
import { selectSidebarCollapsed } from "../../features/ui/uiSlice";
import { cn } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { GlobalSearch } from "./GlobalSearch";
import { UserPanelBadge } from "./UserPanelBadge";
function TopBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector(selectAuthUser);
  const teamMemberId = useAppSelector(selectCurrentTeamMemberId);
  const fullTeamView = hasFullTeamDataView(user?.userRole ?? user?.role);
  const unread = useAppSelector(selectUnreadCount(teamMemberId, fullTeamView));
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-surface-950/70 px-4 backdrop-blur-xl md:px-6",
        "pl-16",
        collapsed ? "lg:pl-[100px]" : "lg:pl-[272px]"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: [
          /* @__PURE__ */ jsx(UserPanelBadge, {}),
          /* @__PURE__ */ jsx(GlobalSearch, {})
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto flex shrink-0 items-center gap-3", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/notifications",
              className: "relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:text-white",
              "aria-label": "Notifications",
              children: [
                /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }),
                unread > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-surface-950", children: unread > 9 ? "9+" : unread })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/profile",
              className: "hidden items-center gap-2 sm:flex",
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 transition hover:bg-white/10", children: [
                /* @__PURE__ */ jsx(
                  Avatar,
                  {
                    initials: user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "U",
                    size: "sm"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-white", children: user?.name ?? "User" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500", children: user?.role ?? "CRM" })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                dispatch(logout());
                navigate("/login", { replace: true });
              },
              className: "rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:border-rose-400/30 hover:text-rose-200",
              "aria-label": "Sign out",
              title: "Sign out",
              children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" })
            }
          )
        ] })
      ]
    }
  );
}
export {
  TopBar
};
