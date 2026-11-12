import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
function StatCard({
  label,
  value,
  change,
  icon: Icon,
  accent = "from-emerald-500/20 to-sky-500/20",
  delay = 0
}) {
  const positive = change !== void 0 && change >= 0;
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.4 },
      whileHover: { y: -4 },
      className: "glass-panel group relative overflow-hidden rounded-2xl p-5",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition group-hover:opacity-90",
              accent
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-slate-400", children: label }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-semibold text-white", children: value }),
            change !== void 0 && /* @__PURE__ */ jsxs(
              "p",
              {
                className: cn(
                  "mt-1 text-xs font-medium",
                  positive ? "text-emerald-300" : "text-rose-300"
                ),
                children: [
                  positive ? "+" : "",
                  change,
                  "% vs last month"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-white/10 bg-white/5 p-2.5 text-emerald-300", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) })
        ] })
      ]
    }
  );
}
export {
  StatCard
};
