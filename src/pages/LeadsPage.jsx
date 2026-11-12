import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import {
  Building2,
  Edit2,
  Filter,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { InputField, SelectField, TextAreaField } from "../components/ui/FormField";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { LEAD_STATUSES } from "../constants/crm";
import { selectScopedLeads } from "../lib/scopedSelectors";
import { teamMembers } from "../data/seed";
import {
  addLead,
  deleteLead,
  setLeadFilter,
  setLeadSearch,
  setLeadsError,
  updateLead
} from "../features/leads/leadsSlice";
import { LEAD_STATUS_STYLES, getTeamMember } from "../lib/lookups";
import { formatCurrency, formatRelativeDate } from "../lib/utils";
const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "new",
  source: "Website",
  value: 0,
  ownerId: teamMembers[0].id,
  notes: ""
};
const statusProgress = {
  new: 15,
  contacted: 30,
  qualified: 50,
  proposal: 68,
  negotiation: 85,
  won: 100,
  lost: 0
};
const sourceColors = ["#34d399", "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#38bdf8"];
function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.company.trim()) errors.company = "Company is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Valid email is required";
  if (form.value < 0) errors.value = "Value must be positive";
  return errors;
}
function leadInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
function LeadsPage() {
  const dispatch = useAppDispatch();
  const scopedLeads = useAppSelector(selectScopedLeads);
  const allLeads = scopedLeads;
  const leads = scopedLeads;
  const filter = useAppSelector((s) => s.leads.filter);
  const search = useAppSelector((s) => s.leads.search);
  const error = useAppSelector((s) => s.leads.error);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const stats = useMemo(() => {
    const totalValue = allLeads.reduce((sum, l) => sum + l.value, 0);
    const qualifiedPlus = allLeads.filter(
      (l) => ["qualified", "proposal", "negotiation", "won"].includes(l.status)
    ).length;
    const avgValue = allLeads.length ? totalValue / allLeads.length : 0;
    return { totalValue, qualifiedPlus, avgValue, count: allLeads.length };
  }, [allLeads]);
  const statusChartData = useMemo(() => {
    return LEAD_STATUSES.map((s) => ({
      status: s.label,
      count: allLeads.filter((l) => l.status === s.id).length,
      id: s.id
    })).filter((row) => row.count > 0);
  }, [allLeads]);
  const sourceChartData = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const lead of allLeads) {
      map.set(lead.source, (map.get(lead.source) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([source, count]) => ({ source, count }));
  }, [allLeads]);
  const topLeads = useMemo(
    () => [...allLeads].sort((a, b) => b.value - a.value).slice(0, 3),
    [allLeads]
  );
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (lead) => {
    setEditing(lead);
    setForm({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      source: lead.source,
      value: lead.value,
      ownerId: lead.ownerId,
      notes: lead.notes
    });
    setErrors({});
    setModalOpen(true);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      dispatch(setLeadsError("Please fix validation errors"));
      return;
    }
    setSubmitting(true);
    dispatch(setLeadsError(null));
    await new Promise((r) => setTimeout(r, 400));
    if (editing) {
      dispatch(updateLead({ ...editing, ...form }));
    } else {
      dispatch(addLead(form));
    }
    setSubmitting(false);
    setModalOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-6", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-800/80 via-surface-900/90 to-surface-950 p-6 md:p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 animate-shimmer opacity-30" }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-12 top-0 h-36 w-36 rounded-full bg-sky-500/15 blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/90", children: "Lead management" }),
          /* @__PURE__ */ jsxs("h2", { className: "mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl", children: [
            "Grow pipeline with",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "high-intent leads" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-sm text-slate-400", children: "Track every prospect from first touch to close. Filter by stage, source, and owner \u2014 then act fast with a clear view of deal value and momentum." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[420px]", children: [
          { label: "Total leads", value: String(stats.count), icon: Users },
          { label: "Pipeline value", value: formatCurrency(stats.totalValue), icon: TrendingUp },
          { label: "Qualified+", value: String(stats.qualifiedPlus), icon: Target },
          { label: "Avg deal", value: formatCurrency(stats.avgValue), icon: Sparkles }
        ].map((item, i) => {
          const Icon = item.icon;
          return /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.05 },
              className: "glass-panel rounded-2xl p-3",
              children: [
                /* @__PURE__ */ jsx(Icon, { className: "mb-2 h-4 w-4 text-emerald-300" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-white", children: item.value }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: item.label })
              ]
            },
            item.label
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        eyebrow: "Workspace",
        title: "Leads",
        description: "Create, view, edit, and track lead status across your revenue funnel.",
        actions: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: openCreate, children: "New lead" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Status breakdown" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Leads per funnel stage" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-48", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: statusChartData, margin: { left: -20 }, children: [
          /* @__PURE__ */ jsx(
            XAxis,
            {
              dataKey: "status",
              stroke: "#64748b",
              tickLine: false,
              axisLine: false,
              tick: { fontSize: 10 }
            }
          ),
          /* @__PURE__ */ jsx(YAxis, { hide: true }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "count", radius: [6, 6, 0, 0], children: statusChartData.map((row) => /* @__PURE__ */ jsx(
            Cell,
            {
              fill: row.id === "won" ? "#34d399" : row.id === "lost" ? "#fb7185" : "#34d399"
            },
            row.id
          )) })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: LEAD_STATUSES.map((s) => {
          const count = allLeads.filter((l) => l.status === s.id).length;
          if (!count) return null;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => dispatch(setLeadFilter(s.id)),
              className: `rounded-full px-2.5 py-1 text-[10px] font-medium transition ${filter === s.id ? "bg-emerald-500/25 text-emerald-100" : "bg-white/5 text-slate-400 hover:text-slate-200"}`,
              children: [
                s.label,
                " (",
                count,
                ")"
              ]
            },
            s.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Lead sources" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Where opportunities originate" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-48", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: sourceChartData,
              dataKey: "count",
              nameKey: "source",
              innerRadius: 45,
              outerRadius: 72,
              paddingAngle: 3,
              children: sourceChartData.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: sourceColors[i % sourceColors.length] }, i))
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, {})
        ] }) }) }),
        /* @__PURE__ */ jsx("ul", { className: "mt-2 space-y-1.5", children: sourceChartData.map((row, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-slate-400", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "h-2 w-2 rounded-full",
                style: { backgroundColor: sourceColors[i % sourceColors.length] }
              }
            ),
            row.source
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-200", children: row.count })
        ] }, row.source)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Highest value leads" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Focus on these accounts first" }),
        /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-3", children: topLeads.map((lead, index) => /* @__PURE__ */ jsxs(
          motion.li,
          {
            initial: { opacity: 0, x: 8 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: index * 0.06 },
            className: "flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3",
            children: [
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-slate-500", children: [
                "#",
                index + 1
              ] }),
              /* @__PURE__ */ jsx(Avatar, { initials: leadInitials(lead.name), size: "sm" }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-white", children: lead.name }),
                /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-slate-500", children: lead.company })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-emerald-200", children: formatCurrency(lead.value) }),
                /* @__PURE__ */ jsx(Badge, { className: `mt-1 ${LEAD_STATUS_STYLES[lead.status]}`, children: lead.status })
              ] })
            ]
          },
          lead.id
        )) })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx(Alert, { variant: "error", className: "mb-4", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "mr-1 inline-flex items-center gap-1 text-xs text-slate-500", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5" }),
          " Filter"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => dispatch(setLeadFilter("all")),
            className: `rounded-full px-3 py-1.5 text-xs font-medium transition ${filter === "all" ? "bg-emerald-500/20 text-emerald-200" : "bg-white/5 text-slate-400 hover:text-slate-200"}`,
            children: "All"
          }
        ),
        LEAD_STATUSES.map((s) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => dispatch(setLeadFilter(s.id)),
            className: `rounded-full px-3 py-1.5 text-xs font-medium transition ${filter === s.id ? "bg-emerald-500/20 text-emerald-200" : "bg-white/5 text-slate-400 hover:text-slate-200"}`,
            children: s.label
          },
          s.id
        ))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex rounded-xl border border-white/10 bg-white/5 p-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("grid"),
              className: `rounded-lg p-2 transition ${viewMode === "grid" ? "bg-emerald-500/20 text-emerald-200" : "text-slate-400"}`,
              "aria-label": "Grid view",
              children: /* @__PURE__ */ jsx(LayoutGrid, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("list"),
              className: `rounded-lg p-2 transition ${viewMode === "list" ? "bg-emerald-500/20 text-emerald-200" : "text-slate-400"}`,
              "aria-label": "List view",
              children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: search,
            onChange: (e) => dispatch(setLeadSearch(e.target.value)),
            placeholder: "Search leads...",
            className: "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40 lg:w-64"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
      "Showing ",
      /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-300", children: leads.length }),
      " lead",
      leads.length === 1 ? "" : "s",
      filter !== "all" && /* @__PURE__ */ jsxs(Fragment, { children: [
        " ",
        "in ",
        /* @__PURE__ */ jsx("span", { className: "text-emerald-300/90", children: filter })
      ] })
    ] }),
    leads.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: Users,
        title: "No leads found",
        description: "Adjust filters or create a new lead to populate your pipeline."
      }
    ) : viewMode === "grid" ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: leads.map((lead, index) => {
      const owner = getTeamMember(lead.ownerId);
      const progress = statusProgress[lead.status];
      return /* @__PURE__ */ jsxs(
        motion.article,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.04 },
          className: "glass-panel group rounded-2xl p-5 transition hover:border-emerald-400/20",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Avatar, { initials: leadInitials(lead.name) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("h3", { className: "truncate font-semibold text-white", children: lead.name }),
                    /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1 truncate text-sm text-slate-400", children: [
                      /* @__PURE__ */ jsx(Building2, { className: "h-3.5 w-3.5 shrink-0" }),
                      lead.company
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(Badge, { className: LEAD_STATUS_STYLES[lead.status], children: lead.status })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-300", children: lead.source }),
                  /* @__PURE__ */ jsx("span", { className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200", children: formatCurrency(lead.value) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-1 flex justify-between text-[10px] text-slate-500", children: [
                /* @__PURE__ */ jsx("span", { children: "Funnel progress" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  progress,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-1.5 overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500 ${lead.status === "lost" ? "from-rose-500 to-rose-400" : ""}`,
                  style: { width: `${progress}%` }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-1.5 text-xs text-slate-400", children: [
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5 text-slate-500" }),
                lead.email
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5 text-slate-500" }),
                lead.phone
              ] }),
              lead.notes && /* @__PURE__ */ jsx("p", { className: "line-clamp-2 pt-1 text-slate-500", children: lead.notes })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between border-t border-white/5 pt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                owner && /* @__PURE__ */ jsx(Avatar, { initials: owner.avatar, size: "sm" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500", children: "Owner" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-300", children: owner?.name })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-500", children: [
                "Updated ",
                formatRelativeDate(lead.updatedAt)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "secondary",
                  className: "flex-1 py-2 text-xs",
                  icon: /* @__PURE__ */ jsx(Edit2, { className: "h-3.5 w-3.5" }),
                  onClick: () => openEdit(lead),
                  children: "Edit"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  className: "px-3",
                  onClick: () => dispatch(deleteLead(lead.id)),
                  "aria-label": "Delete lead",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-rose-300" })
                }
              )
            ] })
          ]
        },
        lead.id
      );
    }) }) : /* @__PURE__ */ jsx("div", { className: "glass-panel overflow-hidden rounded-2xl", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[720px] text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/10 text-xs uppercase tracking-wide text-slate-500", children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Lead" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Source" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Value" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Owner" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Updated" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: leads.map((lead) => {
        const owner = getTeamMember(lead.ownerId);
        return /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "border-b border-white/5 transition hover:bg-white/[0.03]",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(Avatar, { initials: leadInitials(lead.name), size: "sm" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-white", children: lead.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: lead.company })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(Badge, { className: LEAD_STATUS_STYLES[lead.status], children: lead.status }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: lead.source }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-emerald-200", children: formatCurrency(lead.value) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: owner?.name }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-slate-500", children: formatRelativeDate(lead.updatedAt) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    className: "px-2 py-1.5",
                    onClick: () => openEdit(lead),
                    children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    className: "px-2 py-1.5",
                    onClick: () => dispatch(deleteLead(lead.id)),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-rose-300" })
                  }
                )
              ] }) })
            ]
          },
          lead.id
        );
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: modalOpen,
        onClose: () => setModalOpen(false),
        title: editing ? "Edit lead" : "Create lead",
        children: /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit, children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Full name",
                value: form.name,
                onChange: (e) => setForm({ ...form, name: e.target.value }),
                error: errors.name
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Company",
                value: form.company,
                onChange: (e) => setForm({ ...form, company: e.target.value }),
                error: errors.company
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Email",
                type: "email",
                value: form.email,
                onChange: (e) => setForm({ ...form, email: e.target.value }),
                error: errors.email
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Phone",
                value: form.phone,
                onChange: (e) => setForm({ ...form, phone: e.target.value })
              }
            ),
            /* @__PURE__ */ jsx(
              SelectField,
              {
                label: "Status",
                value: form.status,
                onChange: (e) => setForm({ ...form, status: e.target.value }),
                children: LEAD_STATUSES.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.label }, s.id))
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Deal value",
                type: "number",
                value: form.value,
                onChange: (e) => setForm({ ...form, value: Number(e.target.value) })
              }
            ),
            /* @__PURE__ */ jsx(
              SelectField,
              {
                label: "Owner",
                value: form.ownerId,
                onChange: (e) => setForm({ ...form, ownerId: e.target.value }),
                children: teamMembers.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name }, m.id))
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Source",
                value: form.source,
                onChange: (e) => setForm({ ...form, source: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            TextAreaField,
            {
              label: "Notes",
              value: form.notes,
              onChange: (e) => setForm({ ...form, notes: e.target.value })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setModalOpen(false), children: "Cancel" }),
            /* @__PURE__ */ jsx(Button, { type: "submit", loading: submitting, children: editing ? "Save changes" : "Create lead" })
          ] })
        ] })
      }
    )
  ] });
}
export {
  LeadsPage
};
