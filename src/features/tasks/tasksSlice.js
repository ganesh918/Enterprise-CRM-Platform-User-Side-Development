import { createSelector, createSlice } from "@reduxjs/toolkit";
import { initialTasks } from "../../data/seed";
import { generateId } from "../../lib/utils";
const initialState = {
  items: initialTasks,
  filter: "all",
  loading: false,
  error: null
};
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTaskFilter(state, action) {
      state.filter = action.payload;
    },
    setTasksLoading(state, action) {
      state.loading = action.payload;
    },
    setTasksError(state, action) {
      state.error = action.payload;
    },
    addTask(state, action) {
      state.items.unshift({
        ...action.payload,
        id: generateId("task"),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    },
    updateTask(state, action) {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    toggleTaskStatus(state, action) {
      const task = state.items.find((t) => t.id === action.payload);
      if (task) {
        task.status = task.status === "done" ? "todo" : "done";
      }
    },
    deleteTask(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    }
  }
});
const {
  setTaskFilter,
  setTasksLoading,
  setTasksError,
  addTask,
  updateTask,
  toggleTaskStatus,
  deleteTask
} = tasksSlice.actions;
const selectAllTasks = (state) => state.tasks.items;
const selectTaskFilter = (state) => state.tasks.filter;
const selectFilteredTasks = createSelector(
  [
    (state) => state.tasks.items,
    (state) => state.tasks.filter,
    (state) => state.ui.globalSearch
  ],
  (items, filter, globalSearch) => {
    const q = globalSearch.trim().toLowerCase();
    return items.filter((task) => {
      const matchesFilter = filter === "all" || task.status === filter;
      const matchesSearch = !q || task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }
);
var stdin_default = tasksSlice.reducer;
export {
  addTask,
  stdin_default as default,
  deleteTask,
  selectAllTasks,
  selectFilteredTasks,
  selectTaskFilter,
  setTaskFilter,
  setTasksError,
  setTasksLoading,
  toggleTaskStatus,
  updateTask
};
