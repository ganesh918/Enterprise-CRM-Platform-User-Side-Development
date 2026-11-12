import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import activitiesReducer from "../features/activities/activitiesSlice";
import customersReducer from "../features/customers/customersSlice";
import leadsReducer from "../features/leads/leadsSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import pipelineReducer from "../features/pipeline/pipelineSlice";
import profileReducer from "../features/profile/profileSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import uiReducer from "../features/ui/uiSlice";
import { loadPersistedState, savePersistedState } from "./persist";
import { attachWorkspaceGuard } from "./workspaceReseed";
const rootReducer = {
  auth: authReducer,
  leads: leadsReducer,
  pipeline: pipelineReducer,
  customers: customersReducer,
  tasks: tasksReducer,
  activities: activitiesReducer,
  notifications: notificationsReducer,
  profile: profileReducer,
  ui: uiReducer
};
const persisted = loadPersistedState();
const store = configureStore({
  reducer: rootReducer,
  preloadedState: persisted ? {
    leads: persisted.leads,
    pipeline: persisted.pipeline,
    customers: persisted.customers,
    tasks: persisted.tasks,
    activities: persisted.activities,
    notifications: persisted.notifications
  } : void 0
});
store.subscribe(() => {
  savePersistedState(store.getState());
});
attachWorkspaceGuard(store);
export {
  store
};
