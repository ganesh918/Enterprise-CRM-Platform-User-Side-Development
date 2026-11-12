import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
function EmptyState({ icon: Icon, title, description }) {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      className: "glass-panel flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center",
      children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-emerald-300", children: /* @__PURE__ */ jsx(Icon, { className: "h-8 w-8" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-white", children: title }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-md text-sm text-slate-400", children: description })
      ]
    }
  );
}
export {
  EmptyState
};
