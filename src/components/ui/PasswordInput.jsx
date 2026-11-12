import { jsx, jsxs } from "react/jsx-runtime";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  id = "password"
}) {
  const [visible, setVisible] = useState(false);
  return /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", htmlFor: id, children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-slate-400", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          id,
          type: visible ? "text" : "password",
          value,
          onChange: (e) => onChange(e.target.value),
          placeholder,
          autoComplete,
          className: cn(
            "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20",
            error && "border-rose-400/60 focus:border-rose-400/60 focus:ring-rose-400/20"
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setVisible((v) => !v),
          className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-emerald-200",
          "aria-label": visible ? "Hide password" : "Show password",
          children: visible ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-rose-300", children: error })
  ] });
}
export {
  PasswordInput
};
