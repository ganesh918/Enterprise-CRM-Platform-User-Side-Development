import { AUTH_STORAGE_KEY } from '../constants/auth'
import { initialNotifications } from '../features/notifications/notificationsSlice'
import { resolveUserRole } from '../lib/authUsers'
import {
  DEFAULT_WORKSPACE_MEMBER_ID,
  isManagerRole,
  resolveWorkspaceTeamMemberId,
} from '../lib/userScope'

export const STORAGE_KEY = 'nexus-crm-user-v4'

const LEGACY_CRM_KEYS = [
  'nexus-crm-user-v2',
  'nexus-crm-user-v3',
  'nexus-crm-user',
]

function isSliceWithItems(value) {
  return (
    value &&
    typeof value === 'object' &&
    Array.isArray(value.items) &&
    value.items.length > 0
  )
}

function isDealSlice(value) {
  return (
    value &&
    typeof value === 'object' &&
    Array.isArray(value.deals) &&
    value.deals.length > 0
  )
}

function readStoredAuthRaw() {
  try {
    return (
      localStorage.getItem(AUTH_STORAGE_KEY) ??
      sessionStorage.getItem(AUTH_STORAGE_KEY)
    )
  } catch {
    return null
  }
}

export function readHydrationAuth() {
  try {
    const raw = readStoredAuthRaw()
    if (!raw) {
      return {
        teamMemberId: DEFAULT_WORKSPACE_MEMBER_ID,
        managerView: false,
      }
    }
    const parsed = JSON.parse(raw)
    const teamMemberId =
      parsed?.teamMemberId ??
      (parsed?.email
        ? resolveWorkspaceTeamMemberId(parsed.email)
        : DEFAULT_WORKSPACE_MEMBER_ID)
    const userRole = resolveUserRole(parsed)
    return {
      teamMemberId,
      managerView: isManagerRole(userRole),
    }
  } catch {
    return {
      teamMemberId: DEFAULT_WORKSPACE_MEMBER_ID,
      managerView: false,
    }
  }
}

function ownedCount(items, teamMemberId, ownerKey = 'ownerId') {
  if (!Array.isArray(items)) return 0
  return items.filter((item) => item[ownerKey] === teamMemberId).length
}

/** Skip loaded persist when it would show an empty workspace for the signed-in user. */
export function persistedMatchesWorkspace(parsed, hydration = readHydrationAuth()) {
  if (!isSliceWithItems(parsed.leads)) return false
  if (hydration.managerView) return true

  const { teamMemberId } = hydration
  const leadsOwned = ownedCount(parsed.leads.items, teamMemberId)
  const dealsOwned = ownedCount(parsed.pipeline?.deals, teamMemberId)
  const customersOwned = ownedCount(parsed.customers?.items, teamMemberId)
  const tasksOwned = ownedCount(parsed.tasks?.items, teamMemberId, 'assigneeId')
  const activitiesOwned = ownedCount(parsed.activities?.items, teamMemberId)

  return (
    leadsOwned > 0 ||
    dealsOwned > 0 ||
    customersOwned > 0 ||
    tasksOwned > 0 ||
    activitiesOwned > 0
  )
}

export function purgeLegacyCrmStorage() {
  try {
    for (const key of LEGACY_CRM_KEYS) {
      localStorage.removeItem(key)
    }
  } catch {
    // private mode
  }
}

export function clearPersistedCrmState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    purgeLegacyCrmStorage()
  } catch {
    // ignore
  }
}

export function loadPersistedState() {
  purgeLegacyCrmStorage()

  if (import.meta.env.PROD) {
    return undefined
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined

    const parsed = JSON.parse(raw)
    const hydration = readHydrationAuth()

    if (!persistedMatchesWorkspace(parsed, hydration)) {
      return undefined
    }

    if (!isDealSlice(parsed.pipeline)) {
      return undefined
    }

    return {
      leads: parsed.leads,
      pipeline: parsed.pipeline,
      customers: parsed.customers,
      tasks: parsed.tasks,
      activities: parsed.activities,
      notifications: isSliceWithItems(parsed.notifications)
        ? parsed.notifications
        : { items: initialNotifications },
    }
  } catch {
    return undefined
  }
}

export function savePersistedState(state) {
  if (import.meta.env.PROD) {
    return
  }

  try {
    const payload = {
      leads: state.leads,
      pipeline: state.pipeline,
      customers: state.customers,
      tasks: state.tasks,
      activities: state.activities,
      notifications: state.notifications,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // ignore quota / private mode
  }
}
