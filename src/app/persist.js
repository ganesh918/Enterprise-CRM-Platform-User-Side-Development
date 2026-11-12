const STORAGE_KEY = "nexus-crm-user-v1";
function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return void 0;
    return JSON.parse(raw);
  } catch {
    return void 0;
  }
}
function savePersistedState(state) {
  try {
    const payload = {
      leads: state.leads,
      pipeline: state.pipeline,
      customers: state.customers,
      tasks: state.tasks,
      activities: state.activities,
      notifications: state.notifications
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
  }
}
export {
  loadPersistedState,
  savePersistedState
};
