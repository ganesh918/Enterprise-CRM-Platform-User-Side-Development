import { initialNotifications } from '../features/notifications/notificationsSlice'

const STORAGE_KEY = 'nexus-crm-user-v2'

function isSliceWithItems(value) {
  return (
    value &&
    typeof value === 'object' &&
    Array.isArray(value.items) &&
    value.items.length > 0
  )
}

export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined

    const parsed = JSON.parse(raw)

    if (!isSliceWithItems(parsed.leads)) {
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
