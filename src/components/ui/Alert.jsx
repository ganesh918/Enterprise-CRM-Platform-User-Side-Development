import { jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
const styles = {
  error: "border-rose-400/30 bg-rose-500/10 text-rose-200",
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  info: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
};
function Alert({ variant = "info", children, className }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "alert",
      className: cn(
        "rounded-xl border px-4 py-3 text-sm",
        styles[variant],
        className
      ),
      children
    }
  );
}
export {
  Alert
};
