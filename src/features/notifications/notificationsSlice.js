import { createSlice } from '@reduxjs/toolkit'
import { initialNotifications } from '../../data/notificationsSeed'

const initialState = {
  items: initialNotifications,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markRead(state, action) {
      const item = state.items.find((n) => n.id === action.payload)
      if (item) item.read = true
    },
    markAllRead(state, action) {
      for (const item of state.items) {
        if (!action.payload || item.recipientId === action.payload) {
          item.read = true
        }
      }
    },
    addNotification(state, action) {
      state.items.unshift(action.payload)
    },
    hydrateNotifications(state, action) {
      state.items = action.payload
    },
    resetFromSeed(state) {
      state.items = initialNotifications
    },
  },
})

const {
  markRead,
  markAllRead,
  addNotification,
  hydrateNotifications,
  resetFromSeed,
} = notificationsSlice.actions

const selectAllNotifications = (state) => state.notifications.items

export function notificationsForUser(items, teamMemberId, fullTeamView) {
  if (fullTeamView || !teamMemberId) return items
  return items.filter((n) => n.recipientId === teamMemberId)
}

export const selectUnreadCount = (teamMemberId, fullTeamView = false) => (state) => {
  const visible = notificationsForUser(
    state.notifications.items,
    teamMemberId,
    fullTeamView,
  )
  return visible.filter((n) => !n.read).length
}

export {
  addNotification,
  hydrateNotifications,
  initialNotifications,
  markAllRead,
  markRead,
  resetFromSeed,
  selectAllNotifications,
}

export default notificationsSlice.reducer
