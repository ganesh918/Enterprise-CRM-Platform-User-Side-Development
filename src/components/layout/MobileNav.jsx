import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectMobileNavOpen, setMobileNavOpen } from "../../features/ui/uiSlice";
import { useNavItems } from "../../hooks/useNavItems";
import { cn } from "../../lib/utils";
function MobileNav() {
  const open = useAppSelector(selectMobileNavOpen);
  const dispatch = useAppDispatch();
  const navItems = useNavItems();
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-50 lg:hidden",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "absolute inset-0 bg-black/70 backdrop-blur-sm",
            "aria-label": "Close navigation",
            onClick: () => dispatch(setMobileNavOpen(false))
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.nav,
          {
            initial: { x: "-100%" },
            animate: { x: 0 },
            exit: { x: "-100%" },
            transition: { type: "spring", stiffness: 320, damping: 32 },
            className: "relative flex h-full w-[min(85vw,320px)] flex-col border-r border-white/10 bg-surface-900 p-4",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-white", children: "Nexus CRM \u2014 User" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => dispatch(setMobileNavOpen(false)),
                    className: "rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white",
                    children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1 overflow-y-auto", children: navItems.map((item) => /* @__PURE__ */ jsx(
                NavLink,
                {
                  to: item.to,
                  end: item.end,
                  onClick: () => dispatch(setMobileNavOpen(false)),
                  className: ({ isActive }) => cn(
                    "block rounded-xl px-3 py-3 text-sm font-medium",
                    isActive ? "bg-emerald-500/15 text-emerald-200" : "text-slate-300 hover:bg-white/5"
                  ),
                  children: item.label
                },
                item.to
              )) })
            ]
          }
        )
      ]
    }
  ) });
}
export {
  MobileNav
};
