import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
const variants = {
  primary: "bg-gradient-to-r from-emerald-500 to-sky-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35",
  secondary: "glass-panel text-slate-100 hover:bg-white/10",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
  danger: "bg-rose-600/90 text-white hover:bg-rose-500"
};
function Button({
  className,
  variant = "primary",
  loading,
  disabled,
  icon,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
        variants[variant],
        className
      ),
      disabled: disabled || loading,
      ...props,
      children: [
        loading ? /* @__PURE__ */ jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" }) : icon,
        children
      ]
    }
  );
}
export {
  Button
};
