import { teamMembers } from '../data/seed'
import { normalizeRole } from './permissions'

/** Default assignee so any login sees a rich, consistent personal workspace. */
export const DEFAULT_WORKSPACE_MEMBER_ID = 'tm_2'

export function resolveTeamMemberId(email) {
  if (!email) return null
  const normalized = email.trim().toLowerCase()
  const match = teamMembers.find((m) => m.email.toLowerCase() === normalized)
  return match?.id ?? null
}

export function resolveWorkspaceTeamMemberId(email) {
  return resolveTeamMemberId(email) ?? DEFAULT_WORKSPACE_MEMBER_ID
}

export function isManagerRole(role) {
  const r = role?.toLowerCase() ?? ''
  return r === 'manager' || r.includes('manager') || r.includes('director')
}

/** Full CRM dataset for dashboard parity (Vercel = localhost). Only Employee is queue-scoped. */
export function hasFullTeamDataView(role) {
  return normalizeRole(role) !== 'employee'
}

export function scopeByOwner(
  items,
  teamMemberId,
  managerView,
  ownerKey = 'ownerId',
) {
  if (managerView) return items
  if (!teamMemberId) return items
  return items.filter((item) => item[ownerKey] === teamMemberId)
}
