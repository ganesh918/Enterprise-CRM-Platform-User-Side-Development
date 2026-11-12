import { createSelector } from "@reduxjs/toolkit";
import { selectFilteredActivities } from "../features/activities/activitiesSlice";
import { selectFilteredLeads } from "../features/leads/leadsSlice";
import { selectFilteredTasks } from "../features/tasks/tasksSlice";
import { selectAllDeals } from "../features/pipeline/pipelineSlice";
import { selectAllCustomers } from "../features/customers/customersSlice";
import { selectAllActivities } from "../features/activities/activitiesSlice";
import { selectAuthUser, selectCurrentTeamMemberId } from "../features/auth/authSlice";
import { hasFullTeamDataView, scopeByOwner } from "./userScope";
function managerViewFromState(state) {
  const user = selectAuthUser(state);
  return hasFullTeamDataView(user?.userRole ?? user?.role);
}
const selectScopedLeads = createSelector(
  [selectFilteredLeads, selectCurrentTeamMemberId, managerViewFromState],
  (items, teamMemberId, managerView) => scopeByOwner(items, teamMemberId, managerView)
);
const selectScopedDeals = createSelector(
  [selectAllDeals, selectCurrentTeamMemberId, managerViewFromState],
  (items, teamMemberId, managerView) => scopeByOwner(items, teamMemberId, managerView)
);
const selectScopedCustomers = createSelector(
  [selectAllCustomers, selectCurrentTeamMemberId, managerViewFromState],
  (items, teamMemberId, managerView) => scopeByOwner(items, teamMemberId, managerView)
);
const selectScopedActivitiesList = createSelector(
  [selectAllActivities, selectCurrentTeamMemberId, managerViewFromState],
  (items, teamMemberId, managerView) => scopeByOwner(items, teamMemberId, managerView)
);
const selectScopedActivities = createSelector(
  [selectFilteredActivities, selectCurrentTeamMemberId, managerViewFromState],
  (items, teamMemberId, managerView) => scopeByOwner(items, teamMemberId, managerView)
);
const selectScopedTasks = createSelector(
  [selectFilteredTasks, selectCurrentTeamMemberId, managerViewFromState],
  (items, teamMemberId, managerView) => scopeByOwner(items, teamMemberId, managerView, "assigneeId")
);
export {
  selectScopedActivities,
  selectScopedActivitiesList,
  selectScopedCustomers,
  selectScopedDeals,
  selectScopedLeads,
  selectScopedTasks
};
