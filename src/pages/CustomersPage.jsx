import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Crown,
  Edit2,
  Globe,
  LayoutGrid,
  List,
  Mail,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  CustomerFormModal,
  emptyCustomerForm
} from "../components/customers/CustomerFormModal";
import { Avatar } from "../components/ui/Avatar";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import {
  addCustomer,
  deleteCustomer,
  setCustomerSearch,
  setCustomersError,
  setCustomersLoading,
  updateCustomer
} from "../features/customers/customersSlice";
import { getTeamMember } from "../lib/lookups";
import { selectScopedCustomers } from "../lib/scopedSelectors";
import { cn, formatCurrency, formatRelativeDate } from "../lib/utils";
const TIER_STYLES = {
  standard: "bg-slate-500/20 text-slate-200",
  premium: "bg-sky-500/20 text-sky-200",
  enterprise: "bg-emerald-500/20 text-emerald-200"
};
const TIER_GLOW = {
  standard: "from-slate-500/15 to-transparent",
  premium: "from-sky-500/20 to-transparent",
  enterprise: "from-emerald-500/20 to-transparent"
};
const industryColors = ["#34d399", "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#38bdf8", "#f472b6"];
function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
function CustomersPage() {
  const dispatch = useAppDispatch();
  const allCustomers = useAppSelector(selectScopedCustomers);
  const search = useAppSelector((s) => s.customers.search);
  const [tierFilter, setTierFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formInitial, setFormInitial] = useState(emptyCustomerForm);
  const [submitting, setSubmitting] = useState(false);
  const customerError = useAppSelector((s) => s.customers.error);
  const openCreate = () => {
    setEditingCustomer(null);
    setFormInitial(emptyCustomerForm);
    dispatch(setCustomersError(null));
    setModalOpen(true);
  };
  const openEdit = (customer) => {
    setEditingCustomer(customer);
    setFormInitial({
      name: customer.name,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      industry: customer.industry,
      location: customer.location,
      tier: customer.tier,
      ownerId: customer.ownerId,
      lifetimeValue: customer.lifetimeValue,
      tags: customer.tags
    });
    dispatch(setCustomersError(null));
    setModalOpen(true);
  };
  const saveCustomer = async (values) => {
    setSubmitting(true);
    dispatch(setCustomersLoading(true));
    dispatch(setCustomersError(null));
    await new Promise((r) => setTimeout(r, 350));
    if (editingCustomer) {
      dispatch(updateCustomer({ ...editingCustomer, ...values }));
    } else {
      dispatch(addCustomer(values));
    }
    setSubmitting(false);
    dispatch(setCustomersLoading(false));
    setModalOpen(false);
  };
  const stats = useMemo(() => {
    const totalLtv = allCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0);
    const enterprise = allCustomers.filter((c) => c.tier === "enterprise").length;
    const avg = allCustomers.length ? totalLtv / allCustomers.length : 0;
    const industries = new Set(allCustomers.map((c) => c.industry)).size;
    return { totalLtv, enterprise, avg, industries, count: allCustomers.length };
  }, [allCustomers]);
  const industryData = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const c of allCustomers) {
      map.set(c.industry, (map.get(c.industry) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([industry, count]) => ({ industry, count })).sort((a, b) => b.count - a.count);
  }, [allCustomers]);
  const tierData = useMemo(() => {
    const order = ["enterprise", "premium", "standard"];
    return order.map((tier) => ({
      tier,
      count: allCustomers.filter((c) => c.tier === tier).length,
      value: allCustomers.filter((c) => c.tier === tier).reduce((sum, c) => sum + c.lifetimeValue, 0)
    }));
  }, [allCustomers]);
  const topAccounts = useMemo(
    () => [...allCustomers].sort((a, b) => b.lifetimeValue - a.lifetimeValue).slice(0, 4),
    [allCustomers]
  );
  const maxLtv = useMemo(
    () => Math.max(...allCustomers.map((c) => c.lifetimeValue), 1),
    [allCustomers]
  );
  const customers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allCustomers.filter((c) => {
      const matchesTier = tierFilter === "all" || c.tier === tierFilter;
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
      return matchesTier && matchesSearch;
    });
  }, [allCustomers, search, tierFilter]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 overflow-x-hidden pb-6", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-800/80 via-surface-900/90 to-surface-950 p-6 md:p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 animate-shimmer opacity-30" }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300/90", children: "Customer profiles" }),
          /* @__PURE__ */ jsxs("h2", { className: "mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl", children: [
            "Accounts that power",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "long-term growth" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-sm text-slate-400", children: "Explore contact details, lifetime value, and relationship health across every customer \u2014 from first onboarding to enterprise expansion." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[440px]", children: [
          { label: "Accounts", value: String(stats.count), icon: Users },
          { label: "Total LTV", value: formatCurrency(stats.totalLtv), icon: Sparkles },
          { label: "Enterprise", value: String(stats.enterprise), icon: Crown },
          { label: "Industries", value: String(stats.industries), icon: Globe }
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
        title: "Customers",
        description: "Explore account profiles, contact details, and engagement history.",
        actions: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: openCreate, children: "New customer" })
      }
    ),
    customerError && /* @__PURE__ */ jsx(Alert, { variant: "error", children: customerError }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Industry mix" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Accounts by sector" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-44", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: industryData,
              dataKey: "count",
              nameKey: "industry",
              innerRadius: 42,
              outerRadius: 70,
              paddingAngle: 3,
              children: industryData.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: industryColors[i % industryColors.length] }, i))
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, {})
        ] }) }) }),
        /* @__PURE__ */ jsx("ul", { className: "mt-2 max-h-28 space-y-1.5 overflow-y-auto", children: industryData.map((row, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-slate-400", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "h-2 w-2 rounded-full",
                style: { backgroundColor: industryColors[i % industryColors.length] }
              }
            ),
            row.industry
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-200", children: row.count })
        ] }, row.industry)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Tier distribution" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Count and LTV by account tier" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-44", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: tierData, children: [
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "count", radius: [8, 8, 0, 0], children: tierData.map((row) => /* @__PURE__ */ jsx(
            Cell,
            {
              fill: row.tier === "enterprise" ? "#34d399" : row.tier === "premium" ? "#38bdf8" : "#64748b"
            },
            row.tier
          )) })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 space-y-2", children: tierData.map((row) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setTierFilter(row.tier),
            className: "flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-left text-xs transition hover:border-emerald-400/20",
            children: [
              /* @__PURE__ */ jsx("span", { className: "capitalize text-slate-300", children: row.tier }),
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-white", children: [
                row.count,
                " \xB7 ",
                formatCurrency(row.value)
              ] })
            ]
          },
          row.tier
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Highest LTV accounts" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Priority relationships this quarter" }),
        /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-3", children: topAccounts.map((customer, index) => /* @__PURE__ */ jsx(
          motion.li,
          {
            initial: { opacity: 0, x: 8 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: index * 0.05 },
            children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/customers/${customer.id}`,
                className: "flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition hover:border-emerald-400/20",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "w-4 text-sm font-semibold text-slate-500", children: [
                    "#",
                    index + 1
                  ] }),
                  /* @__PURE__ */ jsx(Avatar, { initials: initials(customer.name), size: "sm" }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-white", children: customer.company }),
                    /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-slate-500", children: customer.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-emerald-200", children: formatCurrency(customer.lifetimeValue) }),
                    /* @__PURE__ */ jsx(Badge, { className: `mt-1 ${TIER_STYLES[customer.tier]}`, children: customer.tier })
                  ] })
                ]
              }
            )
          },
          customer.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: ["all", "enterprise", "premium", "standard"].map((tier) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setTierFilter(tier),
          className: cn(
            "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition",
            tierFilter === tier ? "bg-emerald-500/20 text-emerald-200" : "bg-white/5 text-slate-400 hover:text-slate-200"
          ),
          children: tier === "all" ? "All tiers" : tier
        },
        tier
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex rounded-xl border border-white/10 bg-white/5 p-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("grid"),
              className: cn(
                "rounded-lg p-2 transition",
                viewMode === "grid" ? "bg-emerald-500/20 text-emerald-200" : "text-slate-400"
              ),
              "aria-label": "Grid view",
              children: /* @__PURE__ */ jsx(LayoutGrid, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("list"),
              className: cn(
                "rounded-lg p-2 transition",
                viewMode === "list" ? "bg-emerald-500/20 text-emerald-200" : "text-slate-400"
              ),
              "aria-label": "List view",
              children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: search,
            onChange: (e) => dispatch(setCustomerSearch(e.target.value)),
            placeholder: "Search name, company, industry...",
            className: "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-400/40 lg:w-72"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
      "Showing ",
      /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-300", children: customers.length }),
      " account",
      customers.length === 1 ? "" : "s",
      tierFilter !== "all" && /* @__PURE__ */ jsxs(Fragment, { children: [
        " ",
        "in ",
        /* @__PURE__ */ jsx("span", { className: "capitalize text-emerald-300/90", children: tierFilter })
      ] })
    ] }),
    customers.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: Building2,
        title: "No customers match your search",
        description: "Try a different keyword or clear the search filter."
      }
    ) : viewMode === "grid" ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: customers.map((customer, index) => {
      const owner = getTeamMember(customer.ownerId);
      return /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: Math.min(index * 0.03, 0.3) },
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/customers/${customer.id}`,
              className: "glass-panel group relative block overflow-hidden rounded-2xl p-5 transition hover:border-emerald-400/25",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl",
                      TIER_GLOW[customer.tier]
                    )
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "relative flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx(Avatar, { initials: initials(customer.name) }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsx("h3", { className: "truncate font-semibold text-white", children: customer.company }),
                        /* @__PURE__ */ jsx("p", { className: "truncate text-sm text-slate-400", children: customer.name })
                      ] }),
                      /* @__PURE__ */ jsx(Badge, { className: TIER_STYLES[customer.tier], children: customer.tier })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "mt-2 inline-flex rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-300", children: customer.industry })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative mt-4 space-y-1.5 text-xs text-slate-400", children: [
                  /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5 text-slate-500" }),
                    customer.email
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5 text-slate-500" }),
                    customer.location
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative mt-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "mb-1 flex justify-between text-[10px] text-slate-500", children: [
                    /* @__PURE__ */ jsx("span", { children: "Lifetime value" }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-200", children: formatCurrency(customer.lifetimeValue) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500",
                      style: {
                        width: `${Math.max(12, customer.lifetimeValue / maxLtv * 100)}%`
                      }
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "relative mt-4 flex flex-wrap gap-1.5", children: customer.tags.map((tag) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-300",
                    children: tag
                  },
                  tag
                )) }),
                /* @__PURE__ */ jsxs("div", { className: "relative mt-4 flex items-center justify-between border-t border-white/5 pt-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    owner && /* @__PURE__ */ jsx(Avatar, { initials: owner.avatar, size: "sm" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500", children: "Owner" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-300", children: owner?.name })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        className: "rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-emerald-200",
                        onClick: (e) => {
                          e.preventDefault();
                          openEdit(customer);
                        },
                        "aria-label": "Edit customer",
                        children: /* @__PURE__ */ jsx(Edit2, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        className: "rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-rose-300",
                        onClick: (e) => {
                          e.preventDefault();
                          dispatch(deleteCustomer(customer.id));
                        },
                        "aria-label": "Delete customer",
                        children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium text-emerald-300", children: [
                      "Profile",
                      " ",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5 transition group-hover:translate-x-0.5" })
                    ] })
                  ] })
                ] })
              ]
            }
          )
        },
        customer.id
      );
    }) }) : /* @__PURE__ */ jsx("div", { className: "glass-panel overflow-hidden rounded-2xl", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[760px] text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/10 text-xs uppercase tracking-wide text-slate-500", children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Account" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Tier" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Industry" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Location" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "LTV" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Owner" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Since" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: customers.map((customer) => {
        const owner = getTeamMember(customer.ownerId);
        return /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "border-b border-white/5 transition hover:bg-white/[0.03]",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/customers/${customer.id}`,
                  className: "flex items-center gap-3",
                  children: [
                    /* @__PURE__ */ jsx(Avatar, { initials: initials(customer.name), size: "sm" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-white", children: customer.company }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: customer.name })
                    ] })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(Badge, { className: TIER_STYLES[customer.tier], children: customer.tier }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: customer.industry }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: customer.location }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-emerald-200", children: formatCurrency(customer.lifetimeValue) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: owner?.name }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-slate-500", children: formatRelativeDate(customer.createdAt) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    className: "px-2 py-1.5",
                    onClick: () => openEdit(customer),
                    children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    className: "px-2 py-1.5",
                    onClick: () => dispatch(deleteCustomer(customer.id)),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-rose-300" })
                  }
                )
              ] }) })
            ]
          },
          customer.id
        );
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(
      CustomerFormModal,
      {
        open: modalOpen,
        title: editingCustomer ? "Edit customer" : "New customer",
        initial: formInitial,
        loading: submitting,
        onClose: () => setModalOpen(false),
        onSubmit: saveCustomer
      },
      editingCustomer?.id ?? "new"
    )
  ] });
}
export {
  CustomersPage
};
