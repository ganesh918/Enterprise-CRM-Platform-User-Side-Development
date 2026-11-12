import { AUTH_STORAGE_KEY } from '../constants/auth'
import { migrateStoredAuth } from '../features/auth/authSlice'
import { clearPersistedCrmState, purgeLegacyCrmStorage } from './persist'

export const CRM_DATA_VERSION = '6'
const CRM_DATA_VERSION_KEY = 'nexus-crm-data-version'

function clearWorkspaceFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('reset') !== '1') return

    clearPersistedCrmState()
    localStorage.removeItem(AUTH_STORAGE_KEY)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    params.delete('reset')
    const search = params.toString()
    const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    window.history.replaceState(null, '', next)
  } catch {
    // ignore
  }
}

function syncBundledDataVersion() {
  try {
    const prev = localStorage.getItem(CRM_DATA_VERSION_KEY)
    if (prev === CRM_DATA_VERSION) return
    clearPersistedCrmState()
    localStorage.setItem(CRM_DATA_VERSION_KEY, CRM_DATA_VERSION)
  } catch {
    // private mode
  }
}

purgeLegacyCrmStorage()
clearWorkspaceFromQuery()
syncBundledDataVersion()
migrateStoredAuth()
