import { createSlice } from '@reduxjs/toolkit'
import { AUTH_STORAGE_KEY } from '../../constants/auth'
import { resolveWorkspaceTeamMemberId } from '../../lib/userScope'
import { resolveUserRole, roleLabel } from '../../lib/authUsers'

function normalizeUser(parsed) {
  if (!parsed?.email) return null
  const userRole = resolveUserRole(parsed)
  const teamMemberId =
    parsed.teamMemberId ?? resolveWorkspaceTeamMemberId(parsed.email)
  return {
    ...parsed,
    userRole,
    teamMemberId,
    role: parsed.role || roleLabel(userRole),
  }
}

function readStoredAuth() {
  try {
    const raw =
      localStorage.getItem(AUTH_STORAGE_KEY) ??
      sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return { isAuthenticated: false, user: null }
    const parsed = JSON.parse(raw)
    const user = normalizeUser(parsed)
    if (!user) return { isAuthenticated: false, user: null }
    return { isAuthenticated: true, user }
  } catch {
    return { isAuthenticated: false, user: null }
  }
}

const stored = readStoredAuth()

const initialState = {
  ...stored,
  loading: false,
  error: null,
}

function persistUser(user, remember) {
  const payload = JSON.stringify(user)
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(AUTH_STORAGE_KEY)
  if (remember) {
    localStorage.setItem(AUTH_STORAGE_KEY, payload)
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, payload)
  }
}

function clearStoredAuth() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state, action) {
      state.loading = action.payload
    },
    setAuthError(state, action) {
      state.error = action.payload
    },
    loginSuccess(state, action) {
      state.isAuthenticated = true
      state.user = normalizeUser(action.payload.user)
      state.error = null
      state.loading = false
      persistUser(state.user, action.payload.remember)
    },
    updateAuthProfile(state, action) {
      if (!state.user) return
      state.user = normalizeUser({
        ...state.user,
        name: action.payload.name,
        email: action.payload.email,
      })
      const remember = Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
      persistUser(state.user, remember)
    },
    updateAuthAccess(state, action) {
      if (!state.user) return
      const userRole = action.payload.userRole
      state.user = {
        ...state.user,
        userRole,
        role: roleLabel(userRole),
      }
      const remember = Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
      persistUser(state.user, remember)
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.error = null
      state.loading = false
      clearStoredAuth()
    },
  },
})

export const {
  setAuthLoading,
  setAuthError,
  loginSuccess,
  logout,
  updateAuthProfile,
  updateAuthAccess,
} = authSlice.actions

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthUser = (state) => state.auth.user
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectCurrentTeamMemberId = (state) =>
  state.auth.user?.teamMemberId ?? null

export default authSlice.reducer
