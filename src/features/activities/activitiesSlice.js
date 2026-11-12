import { createSelector, createSlice } from "@reduxjs/toolkit";
import { initialActivities } from "../../data/seed";
import { generateId } from "../../lib/utils";
const initialState = {
  items: initialActivities,
  typeFilter: "all",
  loading: false,
  error: null
};
const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    setActivityTypeFilter(state, action) {
      state.typeFilter = action.payload;
    },
    setActivitiesLoading(state, action) {
      state.loading = action.payload;
    },
    setActivitiesError(state, action) {
      state.error = action.payload;
    },
    addActivity(state, action) {
      state.items.unshift({
        ...action.payload,
        id: generateId("act"),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    },
    toggleActivityComplete(state, action) {
      const activity = state.items.find((a) => a.id === action.payload);
      if (activity) activity.completed = !activity.completed;
    },
    updateActivity(state, action) {
      const index = state.items.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    }
  }
});
const {
  setActivityTypeFilter,
  setActivitiesLoading,
  setActivitiesError,
  addActivity,
  toggleActivityComplete,
  updateActivity
} = activitiesSlice.actions;
const selectAllActivities = (state) => state.activities.items;
const selectFilteredActivities = createSelector(
  [
    (state) => state.activities.items,
    (state) => state.activities.typeFilter,
    (state) => state.ui.globalSearch
  ],
  (items, typeFilter, globalSearch) => {
    const q = globalSearch.trim().toLowerCase();
    return items.filter((activity) => {
      const matchesType = typeFilter === "all" || activity.type === typeFilter;
      const matchesSearch = !q || activity.subject.toLowerCase().includes(q) || activity.description.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }
);
var stdin_default = activitiesSlice.reducer;
export {
  addActivity,
  stdin_default as default,
  selectAllActivities,
  selectFilteredActivities,
  setActivitiesError,
  setActivitiesLoading,
  setActivityTypeFilter,
  toggleActivityComplete,
  updateActivity
};
