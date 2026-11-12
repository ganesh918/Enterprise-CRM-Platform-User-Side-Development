import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  CheckSquare,
  DollarSign,
  Mail,
  MessageSquare,
  Percent,
  Phone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  Workflow
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useAppSelector } from "../app/hooks";
import {
  selectAuthUser,
  selectCurrentTeamMemberId
} from "../features/auth/authSlice";
import { hasFullTeamDataView, scopeByOwner } from "../lib/userScope";
import { PIPELINE_STAGES } from "../constants/crm";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import {
  leadConversionFunnel,
  pipelineDistribution,
  quarterlyGoals,
  revenueTrend,
  teamMembers
} from "../data/seed";
import { selectAllActivities } from "../features/activities/activitiesSlice";
import { selectAllCustomers } from "../features/customers/customersSlice";
import { selectAllLeads } from "../features/leads/leadsSlice";
import { selectAllDeals } from "../features/pipeline/pipelineSlice";
import { selectAllTasks } from "../features/tasks/tasksSlice";
import { LEAD_STATUS_STYLES } from "../lib/lookups";
import { formatCurrency, formatRelativeDate } from "../lib/utils";
const funnelColors = ["#64748b", "#38bdf8", "#34d399", "#38bdf8", "#34d399"];
const pieColors = ["#34d399", "#38bdf8", "#38bdf8", "#fbbf24", "#34d399"];
const sourceColors = ["#34d399", "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#38bdf8"];
const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Video,
  note: MessageSquare,
  follow_up: CalendarClock
};
const quickActions = [
  { to: "/leads", label: "Leads", desc: "Qualify inbound", icon: Target, tone: "from-emerald-500/20 to-blue-600/10" },
  { to: "/pipeline", label: "Pipeline", desc: "Move deals forward", icon: Workflow, tone: "from-sky-500/20 to-purple-600/10" },
  { to: "/customers", label: "Accounts", desc: "Review health", icon: Users, tone: "from-emerald-500/20 to-teal-600/10" },
  { to: "/tasks", label: "Tasks", desc: "Clear blockers", icon: CheckSquare, tone: "from-amber-500/20 to-orange-600/10" },
  { to: "/activities", label: "Activities", desc: "Log touchpoints", icon: Activity, tone: "from-teal-500/20 to-pink-600/10" },
  { to: "/pipeline", label: "Forecast", desc: "Check coverage", icon: Sparkles, tone: "from-slate-500/20 to-slate-600/10" }
];
function stageLabel(stage) {
  return PIPELINE_STAGES.find((s) => s.id === stage)?.label ?? stage;
}
function DashboardPage() {
  const user = useAppSelector(selectAuthUser);
  const teamMemberId = useAppSelector(selectCurrentTeamMemberId);
  const managerView = hasFullTeamDataView(user?.userRole ?? user?.role);
  const allLeads = useAppSelector(selectAllLeads);
  const allDeals = useAppSelector(selectAllDeals);
  const allActivities = useAppSelector(selectAllActivities);
  const allTasks = useAppSelector(selectAllTasks);
  const allCustomers = useAppSelector(selectAllCustomers);
  const leads = useMemo(
    () => scopeByOwner(allLeads, teamMemberId, managerView),
    [allLeads, teamMemberId, managerView]
  );
  const deals = useMemo(
    () => scopeByOwner(allDeals, teamMemberId, managerView),
    [allDeals, teamMemberId, managerView]
  );
  const activities = useMemo(
    () => scopeByOwner(allActivities, teamMemberId, managerView),
    [allActivities, teamMemberId, managerView]
  );
  const tasks = useMemo(
    () => scopeByOwner(allTasks, teamMemberId, managerView, "assigneeId"),
    [allTasks, teamMemberId, managerView]
  );
  const customers = useMemo(
    () => scopeByOwner(allCustomers, teamMemberId, managerView),
    [allCustomers, teamMemberId, managerView]
  );
  const openDeals = deals.filter(
    (d) => d.stage !== "closed_won" && d.stage !== "closed_lost"
  );
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedForecast = openDeals.reduce(
    (sum, d) => sum + d.value * (d.probability / 100),
    0
  );
  const wonDeals = deals.filter((d) => d.stage === "closed_won").length;
  const conversionRate = Math.round(wonDeals / Math.max(leads.length, 1) * 100);
  const leadSources = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const lead of leads) {
      counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);
  }, [leads]);
  const teamPerformance = useMemo(() => {
    return teamMembers.map((member) => {
      const memberDeals = deals.filter((d) => d.ownerId === member.id);
      const value = memberDeals.reduce((sum, d) => sum + d.value, 0);
      const memberLeads = leads.filter((l) => l.ownerId === member.id).length;
      return { ...member, value, memberLeads, deals: memberDeals.length };
    }).sort((a, b) => b.value - a.value);
  }, [deals, leads]);
  const topDeals = useMemo(
    () => [...openDeals].sort((a, b) => b.value - a.value).slice(0, 4),
    [openDeals]
  );
  const upcomingTasks = useMemo(
    () => tasks.filter((t) => t.status !== "done" && t.status !== "cancelled").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 4),
    [tasks]
  );
  const hotLeads = useMemo(
    () => [...leads].sort((a, b) => b.value - a.value).slice(0, 3),
    [leads]
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-6", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative mb-2 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-800/80 via-surface-900/90 to-surface-950 p-6 md:p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 animate-shimmer opacity-40" }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0, x: -12 },
              animate: { opacity: 1, x: 0 },
              className: "text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300/90",
              children: "User dashboard"
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.h2,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.05 },
              className: "mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl",
              children: [
                "Your CRM workspace at",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "a glance" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.p,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 },
              className: "mt-3 max-w-xl text-sm leading-relaxed text-slate-400",
              children: [
                "Assigned leads, active customers, open deals, pending tasks, and personal performance metrics",
                managerView ? " across your team" : "",
                "."
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/pipeline",
                className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/35",
                children: [
                  "View pipeline",
                  /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/leads",
                className: "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10",
                children: "Manage leads"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 grid grid-cols-3 gap-2 sm:max-w-lg", children: [
            { label: "Customers", value: customers.length },
            {
              label: "Tasks open",
              value: tasks.filter((t) => t.status !== "done" && t.status !== "cancelled").length
            },
            { label: "Activities", value: activities.length }
          ].map((item, i) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.15 + i * 0.05 },
              className: "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center backdrop-blur-sm",
              children: [
                /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-white", children: item.value }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: item.label })
              ]
            },
            item.label
          )) })
        ] }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.15 },
            className: "glass-panel rounded-2xl p-5",
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "Weighted forecast" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xl font-semibold text-white", children: formatCurrency(weightedForecast) }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 h-2 overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { width: 0 },
                  animate: { width: "72%" },
                  transition: { delay: 0.3, duration: 1 },
                  className: "h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500"
                }
              ) }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-400", children: "72% of quarterly target projected" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase text-slate-500", children: "Raw pipeline" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-emerald-200", children: formatCurrency(pipelineValue) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase text-slate-500", children: "Avg deal size" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-sky-200", children: formatCurrency(openDeals.length ? pipelineValue / openDeals.length : 0) })
                ] })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500", children: "Quick actions" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6", children: quickActions.map((action, index) => {
        const Icon = action.icon;
        return /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.04 },
            children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: action.to,
                className: `glass-panel group flex h-full flex-col rounded-2xl bg-gradient-to-br p-4 transition hover:border-emerald-400/25 ${action.tone}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "mb-3 inline-flex w-fit rounded-xl border border-white/10 bg-white/5 p-2 text-emerald-200 transition group-hover:scale-105", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-white", children: action.label }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: action.desc })
                ]
              }
            )
          },
          action.label
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        eyebrow: "Analytics",
        title: "Dashboard overview",
        description: "Key CRM metrics, sales performance, and lead conversion insights."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsx(
        StatCard,
        {
          label: "Pipeline value",
          value: formatCurrency(pipelineValue),
          change: 12.4,
          icon: DollarSign,
          delay: 0.05
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          label: "Active leads",
          value: String(leads.length),
          change: 8.2,
          icon: Target,
          accent: "from-sky-500/20 to-teal-500/20",
          delay: 0.1
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          label: "Conversion rate",
          value: `${conversionRate}%`,
          change: 3.1,
          icon: Percent,
          accent: "from-emerald-500/20 to-emerald-500/20",
          delay: 0.15
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          label: "Open deals",
          value: String(openDeals.length),
          change: -2.4,
          icon: TrendingUp,
          accent: "from-amber-500/20 to-orange-500/20",
          delay: 0.2
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: quarterlyGoals.map((goal, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.1 + index * 0.05 },
        className: "glass-panel rounded-2xl p-4",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-400", children: goal.label }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-white", children: [
              goal.current,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-2 overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { width: 0 },
              animate: { width: `${goal.current}%` },
              transition: { delay: 0.2 + index * 0.08, duration: 0.8 },
              className: "h-full rounded-full",
              style: { backgroundColor: goal.color }
            }
          ) })
        ]
      },
      goal.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Revenue & lead velocity" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Monthly revenue vs target with inbound lead trend" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-slate-400", children: "USD thousands \xB7 lead count" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-80", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(ComposedChart, { data: revenueTrend, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "revFill", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#34d399", stopOpacity: 0.35 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#34d399", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.06)", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "month", stroke: "#64748b", tickLine: false, axisLine: false }),
          /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", stroke: "#64748b", tickLine: false, axisLine: false }),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              yAxisId: "right",
              orientation: "right",
              stroke: "#64748b",
              tickLine: false,
              axisLine: false
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 12, color: "#94a3b8" } }),
          /* @__PURE__ */ jsx(
            Area,
            {
              yAxisId: "left",
              type: "monotone",
              dataKey: "revenue",
              name: "Revenue",
              stroke: "#34d399",
              fill: "url(#revFill)",
              strokeWidth: 2
            }
          ),
          /* @__PURE__ */ jsx(
            Line,
            {
              yAxisId: "left",
              type: "monotone",
              dataKey: "target",
              name: "Target",
              stroke: "#38bdf8",
              strokeDasharray: "4 4",
              dot: false,
              strokeWidth: 2
            }
          ),
          /* @__PURE__ */ jsx(
            Bar,
            {
              yAxisId: "right",
              dataKey: "leads",
              name: "Leads",
              fill: "#34d399",
              radius: [6, 6, 0, 0],
              barSize: 18,
              opacity: 0.85
            }
          )
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Lead conversion funnel" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Volume by funnel stage" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-80", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: leadConversionFunnel, layout: "vertical", margin: { left: 8 }, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.06)", horizontal: false }),
          /* @__PURE__ */ jsx(XAxis, { type: "number", hide: true }),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              type: "category",
              dataKey: "stage",
              width: 80,
              stroke: "#94a3b8",
              tickLine: false,
              axisLine: false
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "count", radius: [0, 8, 8, 0], children: leadConversionFunnel.map((_, index) => /* @__PURE__ */ jsx(Cell, { fill: funnelColors[index % funnelColors.length] }, index)) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Lead sources" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Where opportunities originate" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-56", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: leadSources, layout: "vertical", margin: { left: 4 }, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.06)", horizontal: false }),
          /* @__PURE__ */ jsx(XAxis, { type: "number", hide: true }),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              type: "category",
              dataKey: "source",
              width: 72,
              stroke: "#94a3b8",
              tickLine: false,
              axisLine: false,
              tick: { fontSize: 11 }
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "count", name: "Leads", radius: [0, 8, 8, 0], children: leadSources.map((_, index) => /* @__PURE__ */ jsx(Cell, { fill: sourceColors[index % sourceColors.length] }, index)) })
        ] }) }) }),
        /* @__PURE__ */ jsx("ul", { className: "mt-2 space-y-2", children: hotLeads.map((lead) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-medium text-slate-200", children: lead.name }),
                /* @__PURE__ */ jsx("p", { className: "truncate text-[10px] text-slate-500", children: lead.company })
              ] }),
              /* @__PURE__ */ jsx(Badge, { className: LEAD_STATUS_STYLES[lead.status], children: lead.status })
            ]
          },
          lead.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Top open opportunities" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Highest-value deals in active stages" })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/pipeline", className: "text-xs text-emerald-300 hover:text-emerald-200", children: "Open pipeline" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: topDeals.map((deal, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -6 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: index * 0.05 },
            className: "rounded-xl border border-white/5 bg-white/[0.03] p-3",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: deal.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: stageLabel(deal.stage) })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-emerald-200", children: formatCurrency(deal.value) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "h-1.5 flex-1 overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500",
                    style: { width: `${deal.probability}%` }
                  }
                ) }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-medium text-slate-400", children: [
                  deal.probability,
                  "% win"
                ] })
              ] })
            ]
          },
          deal.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Team performance" }),
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-slate-500" })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: teamPerformance.map((member, index) => {
          const maxValue = teamPerformance[0]?.value || 1;
          const width = Math.round(member.value / maxValue * 100);
          return /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "w-4 text-xs font-semibold text-slate-500", children: index + 1 }),
            /* @__PURE__ */ jsx(Avatar, { initials: member.avatar, size: "sm" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-slate-200", children: member.name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-white", children: formatCurrency(member.value) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400",
                  style: { width: `${width}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[10px] text-slate-500", children: [
                member.deals,
                " deals \xB7 ",
                member.memberLeads,
                " leads"
              ] })
            ] })
          ] }, member.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Pipeline distribution" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Value by stage (USD thousands)" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-4 md:grid-cols-2 md:items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
            /* @__PURE__ */ jsx(
              Pie,
              {
                data: pipelineDistribution,
                dataKey: "value",
                nameKey: "stage",
                innerRadius: 55,
                outerRadius: 88,
                paddingAngle: 3,
                children: pipelineDistribution.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: pieColors[i % pieColors.length] }, i))
              }
            ),
            /* @__PURE__ */ jsx(Tooltip, {})
          ] }) }) }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: pipelineDistribution.map((item, i) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: "flex items-center justify-between rounded-lg border border-white/5 px-3 py-2",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-sm text-slate-300", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "h-2 w-2 rounded-full",
                      style: { backgroundColor: pieColors[i] }
                    }
                  ),
                  item.stage
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-white", children: [
                  "$",
                  item.value,
                  "k"
                ] })
              ]
            },
            item.stage
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Tasks due soon" }),
          /* @__PURE__ */ jsx(Link, { to: "/tasks", className: "text-xs text-emerald-300 hover:text-emerald-200", children: "All tasks" })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: upcomingTasks.map((task) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "rounded-xl border border-white/5 bg-white/[0.03] p-3",
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-100", children: task.title }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-slate-500", children: [
                "Due ",
                formatRelativeDate(task.dueDate),
                " \xB7 ",
                task.priority
              ] })
            ]
          },
          task.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 xl:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Recent activity" }),
          /* @__PURE__ */ jsx(Link, { to: "/activities", className: "text-xs text-emerald-300 hover:text-emerald-200", children: "View all" })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: activities.slice(0, 6).map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return /* @__PURE__ */ jsxs(
            motion.li,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.04 },
              className: "flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3",
              children: [
                /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-white/10 bg-white/5 p-2 text-emerald-300", children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-100", children: activity.subject }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-0.5 truncate text-xs text-slate-500", children: [
                    formatRelativeDate(activity.scheduledAt),
                    " \xB7 ",
                    activity.type.replace("_", " ")
                  ] })
                ] })
              ]
            },
            activity.id
          );
        }) })
      ] })
    ] })
  ] });
}
export {
  DashboardPage
};
