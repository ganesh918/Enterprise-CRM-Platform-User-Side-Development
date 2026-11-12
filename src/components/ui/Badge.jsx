import { jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
function Badge({ children, className }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      ),
      children
    }
  );
}
export {
  Badge
};
