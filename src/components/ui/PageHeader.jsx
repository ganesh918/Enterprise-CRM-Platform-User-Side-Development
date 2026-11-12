import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
function PageHeader({
  eyebrow,
  title,
  description,
  actions
}) {
  return /* @__PURE__ */ jsxs(
    motion.header,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.45 },
      className: "mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
      children: [
        /* @__PURE__ */ jsxs("div", { children: [
          eyebrow && /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80", children: eyebrow }),
          /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-semibold tracking-tight text-white md:text-4xl", children: title }),
          description && /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm leading-relaxed text-slate-400", children: description })
        ] }),
        actions && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: actions })
      ]
    }
  );
}
export {
  PageHeader
};
