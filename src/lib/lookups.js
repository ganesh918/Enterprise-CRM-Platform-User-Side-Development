import { teamMembers } from "../data/seed";
function getTeamMember(id) {
  return teamMembers.find((m) => m.id === id);
}
const LEAD_STATUS_STYLES = {
  new: "bg-slate-500/20 text-slate-200",
  contacted: "bg-blue-500/20 text-blue-200",
  qualified: "bg-emerald-500/20 text-emerald-200",
  proposal: "bg-sky-500/20 text-sky-200",
  negotiation: "bg-amber-500/20 text-amber-200",
  won: "bg-emerald-500/20 text-emerald-200",
  lost: "bg-rose-500/20 text-rose-200"
};
export {
  LEAD_STATUS_STYLES,
  getTeamMember
};
