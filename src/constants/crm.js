const PIPELINE_STAGES = [
  { id: "discovery", label: "Discovery", color: "from-slate-500 to-slate-600" },
  {
    id: "qualification",
    label: "Qualification",
    color: "from-emerald-500 to-blue-600"
  },
  { id: "proposal", label: "Proposal", color: "from-sky-500 to-purple-600" },
  {
    id: "negotiation",
    label: "Negotiation",
    color: "from-amber-500 to-orange-600"
  },
  { id: "closed_won", label: "Closed Won", color: "from-emerald-500 to-green-600" },
  { id: "closed_lost", label: "Closed Lost", color: "from-rose-500 to-red-600" }
];
const LEAD_STATUSES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" }
];
const PRIORITY_META = {
  low: { label: "Low", className: "bg-slate-500/20 text-slate-300" },
  medium: { label: "Medium", className: "bg-blue-500/20 text-blue-300" },
  high: { label: "High", className: "bg-amber-500/20 text-amber-300" },
  urgent: { label: "Urgent", className: "bg-rose-500/20 text-rose-300" }
};
const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true, module: "dashboard" },
  { to: "/leads", label: "Leads", end: false, module: "leads" },
  { to: "/pipeline", label: "Pipeline", end: false, module: "pipeline" },
  { to: "/customers", label: "Customers", end: false, module: "customers" },
  { to: "/tasks", label: "Tasks", end: false, module: "tasks" },
  { to: "/activities", label: "Activities", end: false, module: "activities" },
  { to: "/reports", label: "Reports", end: false, module: "reports" },
  { to: "/notifications", label: "Notifications", end: false, module: "notifications" },
  { to: "/profile", label: "Profile", end: false, module: "profile" }
];
export {
  LEAD_STATUSES,
  NAV_ITEMS,
  PIPELINE_STAGES,
  PRIORITY_META
};
