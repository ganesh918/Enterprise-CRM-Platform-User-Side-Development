import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Sparkles,
  Target,
  UserRound,
  Users,
  Workflow
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectSidebarCollapsed,
  setMobileNavOpen,
  toggleSidebar
} from "../../features/ui/uiSlice";
import { useNavItems } from "../../hooks/useNavItems";
import { cn } from "../../lib/utils";
const iconMap = {
  "/": LayoutDashboard,
  "/leads": Target,
  "/pipeline": Workflow,
  "/customers": Users,
  "/tasks": Sparkles,
  "/activities": Activity,
  "/reports": BarChart3,
  "/notifications": Bell,
  "/profile": UserRound
};
function Sidebar() {
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const dispatch = useAppDispatch();
  const navItems = useNavItems();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      motion.aside,
      {
        layout: true,
        className: cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/10 bg-surface-900/80 backdrop-blur-xl lg:flex",
          collapsed ? "w-[84px]" : "w-64"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between border-b border-white/10 px-4", children: [
            /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-3", collapsed && "justify-center w-full"), children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-600 shadow-lg shadow-emerald-500/20", children: /* @__PURE__ */ jsx(UserRound, { className: "h-5 w-5 text-white" }) }),
              !collapsed && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-white", children: "Nexus CRM" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wider text-slate-500", children: "User panel" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => dispatch(toggleSidebar()),
                className: "rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white",
                "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
                children: collapsed ? /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-1 overflow-y-auto p-3", children: navItems.map((item) => {
            const Icon = iconMap[item.to] ?? LayoutDashboard;
            return /* @__PURE__ */ jsx(
              NavLink,
              {
                to: item.to,
                end: item.end,
                className: ({ isActive }) => cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive ? "bg-gradient-to-r from-emerald-500/20 to-sky-500/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
                  collapsed && "justify-center px-2"
                ),
                children: ({ isActive }) => /* @__PURE__ */ jsxs(Fragment, { children: [
                  isActive && /* @__PURE__ */ jsx(
                    motion.span,
                    {
                      layoutId: "nav-active",
                      className: "absolute inset-0 rounded-xl border border-emerald-400/20",
                      transition: { type: "spring", stiffness: 380, damping: 30 }
                    }
                  ),
                  /* @__PURE__ */ jsx(Icon, { className: "relative h-4 w-4 shrink-0" }),
                  !collapsed && /* @__PURE__ */ jsx("span", { className: "relative", children: item.label })
                ] })
              },
              item.to
            );
          }) }),
          !collapsed && /* @__PURE__ */ jsxs("div", { className: "m-3 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-sky-600/10 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-emerald-200", children: "Your momentum" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xl font-semibold text-white", children: "On track" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Keep follow-ups current" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "fixed left-4 top-4 z-50 rounded-xl border border-white/10 bg-surface-900/90 p-2.5 text-white backdrop-blur lg:hidden",
        onClick: () => dispatch(setMobileNavOpen(true)),
        "aria-label": "Open navigation",
        children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
      }
    )
  ] });
}
export {
  Sidebar
};
