import { USERS_REGISTRY_KEY } from '../constants/auth'
import { resolveWorkspaceTeamMemberId } from './userScope'

const DEFAULT_USER_ROLE = 'crm_user'

const ROLE_LABELS = {
  crm_user: 'CRM User',
  employee: 'Employee',
  sales_rep: 'Sales Representative',
  manager: 'Sales Manager',
}

export function loadRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users))
}

export function findRegisteredUser(email) {
  const normalized = email.trim().toLowerCase()
  return loadRegisteredUsers().find((u) => u.email.toLowerCase() === normalized)
}

export function registerUser(input) {
  const email = input.email.trim().toLowerCase()
  if (findRegisteredUser(email)) {
    return { ok: false, message: 'An account with this email already exists.' }
  }
  const users = loadRegisteredUsers()
  users.push({
    name: input.name,
    email,
    password: input.password,
    role: 'CRM User',
    userRole: DEFAULT_USER_ROLE,
    teamMemberId: resolveWorkspaceTeamMemberId(email),
    createdAt: new Date().toISOString(),
  })
  saveRegisteredUsers(users)
  return { ok: true }
}

export function updateUserPassword(email, newPassword) {
  const normalized = email.trim().toLowerCase()
  const users = loadRegisteredUsers()
  const idx = users.findIndex((u) => u.email === normalized)
  if (idx === -1) {
    users.push({
      name: displayNameFromEmail(normalized),
      email: normalized,
      password: newPassword,
      role: 'CRM User',
      userRole: DEFAULT_USER_ROLE,
      teamMemberId: resolveWorkspaceTeamMemberId(normalized),
      createdAt: new Date().toISOString(),
    })
    saveRegisteredUsers(users)
    return { ok: true }
  }
  users[idx] = { ...users[idx], password: newPassword }
  saveRegisteredUsers(users)
  return { ok: true }
}

export function updateRegisteredUserProfile(email, patch) {
  const normalized = email.trim().toLowerCase()
  const users = loadRegisteredUsers()
  const idx = users.findIndex((u) => u.email === normalized)
  if (idx === -1) return
  users[idx] = { ...users[idx], ...patch }
  saveRegisteredUsers(users)
}

export function buildSessionUser(email) {
  const normalized = email.trim().toLowerCase()
  const registered = findRegisteredUser(normalized)
  const userRole = registered?.userRole ?? DEFAULT_USER_ROLE
  const teamMemberId =
    registered?.teamMemberId ?? resolveWorkspaceTeamMemberId(normalized)

  if (registered) {
    return {
      name: registered.name,
      email: normalized,
      role: ROLE_LABELS[userRole] ?? registered.role ?? 'CRM User',
      userRole,
      teamMemberId,
    }
  }

  return {
    name: displayNameFromEmail(normalized),
    email: normalized,
    role: ROLE_LABELS[userRole],
    userRole,
    teamMemberId,
  }
}

export function displayNameFromEmail(email) {
  const local = email.split('@')[0] ?? 'User'
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function isValidEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function resolveUserRole(user) {
  if (user?.userRole) return user.userRole
  const r = (user?.role ?? '').toLowerCase()
  if (r === 'manager' || r.includes('director')) return 'manager'
  if (r === 'employee') return 'employee'
  if (r.includes('crm user') || r === 'crm_user') return 'crm_user'
  if (r.includes('sales')) return 'sales_rep'
  return DEFAULT_USER_ROLE
}

export function roleLabel(userRole) {
  return ROLE_LABELS[userRole] ?? 'CRM User'
}
