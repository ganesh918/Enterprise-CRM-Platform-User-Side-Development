const ROLE_MODULES = {
  crm_user: [
    "dashboard",
    "leads",
    "pipeline",
    "customers",
    "tasks",
    "activities",
    "reports",
    "notifications",
    "profile"
  ],
  employee: [
    "dashboard",
    "leads",
    "customers",
    "tasks",
    "activities",
    "notifications",
    "profile"
  ],
  sales_rep: [
    "dashboard",
    "leads",
    "pipeline",
    "customers",
    "tasks",
    "activities",
    "reports",
    "notifications",
    "profile"
  ],
  manager: [
    "dashboard",
    "leads",
    "pipeline",
    "customers",
    "tasks",
    "activities",
    "reports",
    "notifications",
    "profile"
  ]
};
function normalizeRole(role) {
  const r = role?.toLowerCase() ?? "";
  if (r.includes("manager") || r.includes("director")) return "manager";
  if (r.includes("crm user") || r === "crm_user") return "crm_user";
  if (r.includes("sales") || r.includes("executive") || r.includes("sdr"))
    return "sales_rep";
  if (
    r === "crm_user" ||
    r === "sales_rep" ||
    r === "employee" ||
    r === "manager"
  )
    return r;
  return "crm_user";
}
function canAccessModule(role, module) {
  const normalized = normalizeRole(role);
  return ROLE_MODULES[normalized].includes(module);
}
function moduleFromPath(pathname) {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  const map = {
    "": "dashboard",
    leads: "leads",
    pipeline: "pipeline",
    customers: "customers",
    tasks: "tasks",
    activities: "activities",
    reports: "reports",
    notifications: "notifications",
    profile: "profile"
  };
  return map[segment] ?? null;
}
export {
  canAccessModule,
  moduleFromPath,
  normalizeRole
};
