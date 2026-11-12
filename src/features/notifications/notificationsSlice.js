import { createSlice } from "@reduxjs/toolkit";
const now = /* @__PURE__ */ new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1e3).toISOString();
const initialNotifications = [
  {
    id: "n_1",
    kind: "lead_assignment",
    title: "New lead assigned",
    message: "Amira Hassan from Desert Solar Co was assigned to you.",
    link: "/leads",
    recipientId: "tm_4",
    read: false,
    createdAt: hoursAgo(2)
  },
  {
    id: "n_2",
    kind: "task_reminder",
    title: "Task due today",
    message: "Follow up with Horizon Logistics before 5 PM.",
    link: "/tasks",
    recipientId: "tm_2",
    read: false,
    createdAt: hoursAgo(4)
  },
  {
    id: "n_3",
    kind: "meeting",
    title: "Upcoming meeting",
    message: "Quarterly pipeline review at 3:00 PM.",
    link: "/activities",
    recipientId: "tm_1",
    read: false,
    createdAt: hoursAgo(6)
  },
  {
    id: "n_4",
    kind: "update",
    title: "Deal stage updated",
    message: "Pulse Fintech moved to Negotiation.",
    link: "/pipeline",
    recipientId: "tm_1",
    read: true,
    createdAt: hoursAgo(20)
  }
];
const initialState = {
  items: initialNotifications
};
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markRead(state, action) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllRead(state, action) {
      for (const item of state.items) {
        if (!action.payload || item.recipientId === action.payload) {
          item.read = true;
        }
      }
    },
    addNotification(state, action) {
      state.items.unshift(action.payload);
    },
    hydrateNotifications(state, action) {
      state.items = action.payload;
    },
    resetFromSeed(state) {
      state.items = initialNotifications;
    }
  }
});
const {
  markRead,
  markAllRead,
  addNotification,
  hydrateNotifications,
  resetFromSeed
} = notificationsSlice.actions;
const selectAllNotifications = (state) => state.notifications.items;
const selectUnreadCount = (teamMemberId) => (state) => {
  if (!teamMemberId) return 0;
  return state.notifications.items.filter(
    (n) => n.recipientId === teamMemberId && !n.read
  ).length;
};
var stdin_default = notificationsSlice.reducer;
export {
  addNotification,
  stdin_default as default,
  hydrateNotifications,
  initialNotifications,
  markAllRead,
  markRead,
  resetFromSeed,
  selectAllNotifications,
  selectUnreadCount
};
