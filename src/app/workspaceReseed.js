import { resetFromSeed as resetActivitiesFromSeed } from '../features/activities/activitiesSlice'
import { resetFromSeed as resetCustomersFromSeed } from '../features/customers/customersSlice'
import { resetFromSeed as resetLeadsFromSeed } from '../features/leads/leadsSlice'
import { resetFromSeed as resetNotificationsFromSeed } from '../features/notifications/notificationsSlice'
import { resetFromSeed as resetPipelineFromSeed } from '../features/pipeline/pipelineSlice'
import { resetFromSeed as resetTasksFromSeed } from '../features/tasks/tasksSlice'
import { resolveUserRole } from '../lib/authUsers'
import { hasFullTeamDataView, scopeByOwner } from '../lib/userScope'
import { clearPersistedCrmState } from './persist'

export function workspaceNeedsReseed(state) {
  const user = state.auth.user
  if (!state.auth.isAuthenticated || !user) return false

  const userRole = resolveUserRole(user)
  if (hasFullTeamDataView(userRole)) return false

  const teamMemberId = user.teamMemberId
  if (!teamMemberId) return false

  const scopedLeads = scopeByOwner(state.leads.items, teamMemberId, false)
  const scopedDeals = scopeByOwner(state.pipeline.deals, teamMemberId, false)
  const scopedCustomers = scopeByOwner(state.customers.items, teamMemberId, false)

  const hasAnyScoped =
    scopedLeads.length > 0 ||
    scopedDeals.length > 0 ||
    scopedCustomers.length > 0

  if (hasAnyScoped) return false

  const hasAnyData =
    state.leads.items.length > 0 ||
    state.pipeline.deals.length > 0 ||
    state.customers.items.length > 0

  return hasAnyData || state.leads.items.length === 0
}

export function reseedWorkspace(dispatch) {
  dispatch(resetLeadsFromSeed())
  dispatch(resetPipelineFromSeed())
  dispatch(resetCustomersFromSeed())
  dispatch(resetTasksFromSeed())
  dispatch(resetActivitiesFromSeed())
  dispatch(resetNotificationsFromSeed())
  clearPersistedCrmState()
}

export function attachWorkspaceGuard(store) {
  let checking = false
  let lastUserKey = null

  const sync = () => {
    const user = store.getState().auth.user
    const userKey = user?.email
      ? `${user.email}:${user.teamMemberId}`
      : null

    if (!userKey || userKey === lastUserKey) return
    lastUserKey = userKey

    if (checking) return
    if (!workspaceNeedsReseed(store.getState())) return

    checking = true
    reseedWorkspace(store.dispatch)
    checking = false
  }

  sync()
  store.subscribe(sync)
}
