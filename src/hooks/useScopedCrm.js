import { useMemo } from "react";
import { useAppSelector } from "../app/hooks";
import {
  selectAuthUser,
  selectCurrentTeamMemberId
} from "../features/auth/authSlice";
import { selectAllActivities } from "../features/activities/activitiesSlice";
import { selectAllCustomers } from "../features/customers/customersSlice";
import { selectAllLeads } from "../features/leads/leadsSlice";
import { selectAllDeals } from "../features/pipeline/pipelineSlice";
import { selectAllTasks } from "../features/tasks/tasksSlice";
import { isManagerRole, scopeByOwner } from "../lib/userScope";
function useScopedCrm() {
  const user = useAppSelector(selectAuthUser);
  const teamMemberId = useAppSelector(selectCurrentTeamMemberId);
  const managerView = isManagerRole(user?.userRole ?? user?.role);
  const allLeads = useAppSelector(selectAllLeads);
  const allDeals = useAppSelector(selectAllDeals);
  const allCustomers = useAppSelector(selectAllCustomers);
  const allTasks = useAppSelector(selectAllTasks);
  const allActivities = useAppSelector(selectAllActivities);
  const leads = useMemo(
    () => scopeByOwner(allLeads, teamMemberId, managerView),
    [allLeads, teamMemberId, managerView]
  );
  const deals = useMemo(
    () => scopeByOwner(allDeals, teamMemberId, managerView),
    [allDeals, teamMemberId, managerView]
  );
  const customers = useMemo(
    () => scopeByOwner(allCustomers, teamMemberId, managerView),
    [allCustomers, teamMemberId, managerView]
  );
  const tasks = useMemo(
    () => scopeByOwner(allTasks, teamMemberId, managerView, "assigneeId"),
    [allTasks, teamMemberId, managerView]
  );
  const activities = useMemo(
    () => scopeByOwner(allActivities, teamMemberId, managerView),
    [allActivities, teamMemberId, managerView]
  );
  return {
    leads,
    deals,
    customers,
    tasks,
    activities,
    managerView,
    teamMemberId
  };
}
export {
  useScopedCrm
};
