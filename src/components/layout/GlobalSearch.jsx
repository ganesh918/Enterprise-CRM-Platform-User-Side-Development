import { jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectGlobalSearchResults } from "../../features/search/selectors";
import { setGlobalSearch } from "../../features/ui/uiSlice";
function GlobalSearch() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((s) => s.ui.globalSearch);
  const results = useAppSelector(selectGlobalSearchResults);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  const showPanel = open && query.trim().length > 0;
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: "relative hidden max-w-md flex-1 md:block", children: [
    /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        value: query,
        onChange: (e) => {
          dispatch(setGlobalSearch(e.target.value));
          setOpen(true);
        },
        onFocus: () => setOpen(true),
        placeholder: "Search leads, customers, deals...",
        "aria-label": "Global search",
        className: "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/15"
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: showPanel && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 4 },
        className: "absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[min(70vh,420px)] overflow-y-auto rounded-2xl border border-white/10 bg-surface-900/95 p-3 shadow-2xl backdrop-blur-xl",
        children: results.total === 0 ? /* @__PURE__ */ jsxs("p", { className: "px-2 py-4 text-center text-sm text-slate-400", children: [
          "No results for \u201C",
          query,
          "\u201D"
        ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          results.leads.length > 0 && /* @__PURE__ */ jsx(Section, { title: "Leads", children: results.leads.map((l) => /* @__PURE__ */ jsx(
            ResultLink,
            {
              to: "/leads",
              primary: l.name,
              secondary: l.company,
              onPick: () => setOpen(false)
            },
            l.id
          )) }),
          results.customers.length > 0 && /* @__PURE__ */ jsx(Section, { title: "Customers", children: results.customers.map((c) => /* @__PURE__ */ jsx(
            ResultLink,
            {
              to: `/customers/${c.id}`,
              primary: c.company,
              secondary: c.name,
              onPick: () => setOpen(false)
            },
            c.id
          )) }),
          results.deals.length > 0 && /* @__PURE__ */ jsx(Section, { title: "Deals", children: results.deals.map((d) => /* @__PURE__ */ jsx(
            ResultLink,
            {
              to: "/pipeline",
              primary: d.title,
              secondary: d.company,
              onPick: () => setOpen(false)
            },
            d.id
          )) }),
          results.tasks.length > 0 && /* @__PURE__ */ jsx(Section, { title: "Tasks", children: results.tasks.map((t) => /* @__PURE__ */ jsx(
            ResultLink,
            {
              to: "/tasks",
              primary: t.title,
              secondary: t.status.replace("_", " "),
              onPick: () => setOpen(false)
            },
            t.id
          )) })
        ] })
      }
    ) })
  ] });
}
function Section({ title, children }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500", children: title }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-0.5", children })
  ] });
}
function ResultLink({
  to,
  primary,
  secondary,
  onPick
}) {
  return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
    Link,
    {
      to,
      onClick: onPick,
      className: "block rounded-lg px-2 py-2 transition hover:bg-white/5",
      children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: primary }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: secondary })
      ]
    }
  ) });
}
export {
  GlobalSearch
};
