import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown } from "lucide-react";
import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import { cn } from "../../lib/utils";
function parseSelectOptions(children) {
  return Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === "option"
  ).map((option) => ({
    value: String(option.props.value ?? ""),
    label: String(option.props.children ?? option.props.value ?? "")
  }));
}
const selectTriggerClass = "flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50";
function InputField({
  label,
  error,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-slate-400", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        className: cn(
          "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20",
          error && "border-rose-400/60 focus:border-rose-400/60 focus:ring-rose-400/20",
          className
        ),
        ...props
      }
    ),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-rose-300", children: error })
  ] });
}
function SelectField({
  label,
  error,
  className,
  children,
  value,
  onChange,
  disabled,
  id: idProp,
  name,
  required
}) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;
  const options = parseSelectOptions(children);
  const stringValue = value === void 0 || value === null ? "" : String(value);
  const selected = options.find((o) => o.value === stringValue) ?? options[0];
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);
  const pick = (nextValue) => {
    if (disabled) return;
    setOpen(false);
    if (!onChange) return;
    onChange({
      target: { value: nextValue, name: name ?? "" },
      currentTarget: { value: nextValue, name: name ?? "" }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("relative block space-y-1.5", open && "z-30"), ref: rootRef, children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        id: `${id}-label`,
        className: "text-xs font-medium uppercase tracking-wide text-slate-400",
        children: label
      }
    ),
    /* @__PURE__ */ jsx(
      "select",
      {
        className: "sr-only",
        tabIndex: -1,
        "aria-hidden": true,
        value: stringValue,
        onChange,
        name,
        required,
        disabled,
        children
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        id,
        disabled,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-labelledby": `${id}-label`,
        "aria-controls": listboxId,
        className: cn(
          selectTriggerClass,
          error && "border-rose-400/60 focus:border-rose-400/60 focus:ring-rose-400/20",
          className
        ),
        onClick: () => !disabled && setOpen((v) => !v),
        onKeyDown: (e) => {
          if (disabled) return;
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        },
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: selected?.label ?? "Select\u2026" }),
          /* @__PURE__ */ jsx(
            ChevronDown,
            {
              className: cn("h-4 w-4 shrink-0 text-slate-400 transition", open && "rotate-180")
            }
          )
        ]
      }
    ),
    open && options.length > 0 && /* @__PURE__ */ jsx(
      "ul",
      {
        id: listboxId,
        role: "listbox",
        "aria-labelledby": `${id}-label`,
        className: "absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-white/15 bg-surface-800 py-1 shadow-xl shadow-black/40",
        children: options.map((option) => {
          const isSelected = option.value === stringValue;
          return /* @__PURE__ */ jsx("li", { role: "presentation", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "option",
              "aria-selected": isSelected,
              className: cn(
                "w-full px-3 py-2.5 text-left text-sm transition",
                isSelected ? "bg-emerald-500/20 text-emerald-100" : "text-slate-200 hover:bg-white/10 hover:text-white"
              ),
              onClick: () => pick(option.value),
              children: option.label
            }
          ) }, option.value);
        })
      }
    ),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-rose-300", children: error })
  ] });
}
function TextAreaField({
  label,
  error,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-slate-400", children: label }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "min-h-24 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20",
          className
        ),
        ...props
      }
    ),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-rose-300", children: error })
  ] });
}
export {
  InputField,
  SelectField,
  TextAreaField
};
