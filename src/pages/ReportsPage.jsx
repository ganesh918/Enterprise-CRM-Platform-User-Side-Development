import { jsx, jsxs } from "react/jsx-runtime";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useMemo } from "react";
import { useAppSelector } from "../app/hooks";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { selectAuthUser, selectCurrentTeamMemberId } from "../features/auth/authSlice";
import { selectAllActivities } from "../features/activities/activitiesSlice";
import { selectAllLeads } from "../features/leads/leadsSlice";
import { selectAllDeals } from "../features/pipeline/pipelineSlice";
import { selectAllTasks } from "../features/tasks/tasksSlice";
import { hasFullTeamDataView, scopeByOwner } from "../lib/userScope";
import { formatCurrency } from "../lib/utils";
import { Percent, Target, TrendingUp, CheckSquare } from "lucide-react";
const pieColors = ["#34d399", "#38bdf8", "#34d399", "#fbbf24", "#fb7185"];
function ReportsPage() {
  const user = useAppSelector(selectAuthUser);
  const teamMemberId = useAppSelector(selectCurrentTeamMemberId);
  const managerView = hasFullTeamDataView(user?.userRole ?? user?.role);
  const leads = useAppSelector(selectAllLeads);
  const deals = useAppSelector(selectAllDeals);
  const tasks = useAppSelector(selectAllTasks);
  const activities = useAppSelector(selectAllActivities);
  const scopedLeads = useMemo(
    () => scopeByOwner(leads, teamMemberId, managerView),
    [leads, teamMemberId, managerView]
  );
  const scopedDeals = useMemo(
    () => scopeByOwner(deals, teamMemberId, managerView),
    [deals, teamMemberId, managerView]
  );
  const scopedTasks = useMemo(
    () => scopeByOwner(tasks, teamMemberId, managerView, "assigneeId"),
    [tasks, teamMemberId, managerView]
  );
  const scopedActivities = useMemo(
    () => scopeByOwner(activities, teamMemberId, managerView),
    [activities, teamMemberId, managerView]
  );
  const wonDeals = scopedDeals.filter((d) => d.stage === "closed_won");
  const conversionRate = Math.round(
    wonDeals.length / Math.max(scopedLeads.length, 1) * 100
  );
  const revenueWon = wonDeals.reduce((s, d) => s + d.value, 0);
  const tasksDone = scopedTasks.filter((t) => t.status === "done").length;
  const taskCompletion = Math.round(
    tasksDone / Math.max(scopedTasks.length, 1) * 100
  );
  const conversionTrend = useMemo(() => {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => ({
      month,
      leads: Math.max(2, Math.round(scopedLeads.length / 6) + i % 3),
      won: Math.max(1, Math.round(wonDeals.length / 6) + i % 2)
    }));
  }, [scopedLeads.length, wonDeals.length]);
  const taskStats = useMemo(() => {
    const buckets = { todo: 0, in_progress: 0, done: 0 };
    for (const t of scopedTasks) {
      if (t.status === "cancelled") continue;
      if (t.status in buckets) buckets[t.status] += 1;
    }
    return [
      { name: "To do", value: buckets.todo },
      { name: "In progress", value: buckets.in_progress },
      { name: "Done", value: buckets.done }
    ];
  }, [scopedTasks]);
  const activityBreakdown = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const a of scopedActivities) {
      counts.set(a.type, (counts.get(a.type) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([type, count]) => ({
      type: type.replace("_", " "),
      count
    }));
  }, [scopedActivities]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Reports & analytics",
        description: "Personal performance, conversion, deals, and task statistics."
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsx(
        StatCard,
        {
          label: "Lead conversion",
          value: `${conversionRate}%`,
          change: 4.2,
          icon: Percent
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          label: "Revenue won",
          value: formatCurrency(revenueWon),
          change: 12.1,
          icon: TrendingUp,
          accent: "from-sky-500/20 to-teal-500/20"
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          label: "Deals closed",
          value: String(wonDeals.length),
          change: 2,
          icon: Target,
          accent: "from-emerald-500/20 to-teal-500/20"
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          label: "Task completion",
          value: `${taskCompletion}%`,
          change: 6.5,
          icon: CheckSquare,
          accent: "from-amber-500/20 to-orange-500/20"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Lead conversion trend" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Leads vs won opportunities" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: conversionTrend, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.06)" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "month", stroke: "#64748b", fontSize: 11 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#64748b", fontSize: 11 }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Legend, {}),
          /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "leads", stroke: "#34d399", strokeWidth: 2 }),
          /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "won", stroke: "#38bdf8", strokeWidth: 2 })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Task status" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Workload distribution" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: taskStats,
              dataKey: "value",
              nameKey: "name",
              innerRadius: 55,
              outerRadius: 85,
              paddingAngle: 4,
              children: taskStats.map((_, index) => /* @__PURE__ */ jsx(Cell, { fill: pieColors[index % pieColors.length] }, index))
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Legend, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-2xl p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Activity volume" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Calls, meetings, and follow-ups" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: activityBreakdown, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.06)" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "type", stroke: "#64748b", fontSize: 11 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#64748b", fontSize: 11 }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "count", fill: "#34d399", radius: [6, 6, 0, 0] })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  ReportsPage
};
