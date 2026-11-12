import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectSidebarCollapsed } from "../../features/ui/uiSlice";
import { cn } from "../../lib/utils";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { WorkspaceModeBanner } from "./WorkspaceModeBanner";
function AmbientBackground() {
  return /* @__PURE__ */ jsxs("div", { "aria-hidden": true, className: "pointer-events-none fixed inset-0 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "hero-orb absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "hero-orb absolute right-0 top-1/3 h-96 w-96 rounded-full bg-sky-600/15 blur-3xl",
        style: { animationDelay: "1.5s" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.1),transparent_45%)]" })
  ] });
}
function AppShell() {
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const location = useLocation();
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen bg-surface-950 text-slate-100", children: [
    /* @__PURE__ */ jsx(AmbientBackground, {}),
    /* @__PURE__ */ jsx(Sidebar, {}),
    /* @__PURE__ */ jsx(MobileNav, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "relative min-h-screen transition-[padding] duration-300",
          collapsed ? "lg:pl-[84px]" : "lg:pl-64"
        ),
        children: [
          /* @__PURE__ */ jsx(TopBar, {}),
          /* @__PURE__ */ jsx(
            motion.main,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35 },
              className: "px-4 py-6 md:px-6 lg:px-8",
              children: /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(WorkspaceModeBanner, {}),
                /* @__PURE__ */ jsx(Outlet, {})
              ] })
            },
            location.pathname
          )
        ]
      }
    )
  ] });
}
export {
  AppShell
};
