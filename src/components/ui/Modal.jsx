import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../../lib/utils";
function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": "Close dialog",
            className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
            onClick: onClose
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "modal-title",
            initial: { opacity: 0, y: 24, scale: 0.96 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 16, scale: 0.98 },
            transition: { type: "spring", stiffness: 380, damping: 28 },
            className: cn(
              "relative z-10 w-full max-w-lg glass-panel-strong glow-ring rounded-2xl p-6 shadow-2xl",
              className
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsx("h2", { id: "modal-title", className: "text-lg font-semibold text-white", children: title }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white",
                    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              children
            ]
          }
        )
      ]
    }
  ) });
}
export {
  Modal
};
