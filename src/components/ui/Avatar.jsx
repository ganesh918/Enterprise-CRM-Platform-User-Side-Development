import { jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
const sizes = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm"
};
function Avatar({ initials, className, size = "md" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-sky-600/40 font-semibold text-white ring-2 ring-white/10",
        sizes[size],
        className
      ),
      "aria-hidden": true,
      children: initials
    }
  );
}
export {
  Avatar
};
