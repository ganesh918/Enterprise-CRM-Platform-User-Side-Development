import { createSelector, createSlice } from "@reduxjs/toolkit";
import { initialLeads } from "../../data/seed";
import { generateId } from "../../lib/utils";
const initialState = {
  items: initialLeads,
  loading: false,
  error: null,
  filter: "all",
  search: ""
};
const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setLeadsLoading(state, action) {
      state.loading = action.payload;
    },
    setLeadsError(state, action) {
      state.error = action.payload;
    },
    setLeadFilter(state, action) {
      state.filter = action.payload;
    },
    setLeadSearch(state, action) {
      state.search = action.payload;
    },
    addLead(state, action) {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      state.items.unshift({
        ...action.payload,
        id: generateId("lead"),
        createdAt: now,
        updatedAt: now
      });
    },
    updateLead(state, action) {
      const index = state.items.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
    },
    deleteLead(state, action) {
      state.items = state.items.filter((l) => l.id !== action.payload);
    },
    updateLeadStatus(state, action) {
      const lead = state.items.find((l) => l.id === action.payload.id);
      if (lead) {
        lead.status = action.payload.status;
        lead.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      }
    }
  }
});
const {
  setLeadsLoading,
  setLeadsError,
  setLeadFilter,
  setLeadSearch,
  addLead,
  updateLead,
  deleteLead,
  updateLeadStatus
} = leadsSlice.actions;
const selectAllLeads = (state) => state.leads.items;
const selectLeadsFilter = (state) => state.leads.filter;
const selectLeadsSearch = (state) => state.leads.search;
const selectLeadsLoading = (state) => state.leads.loading;
const selectFilteredLeads = createSelector(
  [
    (state) => state.leads.items,
    (state) => state.leads.filter,
    (state) => state.leads.search,
    (state) => state.ui.globalSearch
  ],
  (items, filter, search, globalSearch) => {
    const q = (search || globalSearch).trim().toLowerCase();
    return items.filter((lead) => {
      const matchesFilter = filter === "all" || lead.status === filter;
      const matchesSearch = !q || lead.name.toLowerCase().includes(q) || lead.company.toLowerCase().includes(q) || lead.email.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }
);
var stdin_default = leadsSlice.reducer;
export {
  addLead,
  stdin_default as default,
  deleteLead,
  selectAllLeads,
  selectFilteredLeads,
  selectLeadsFilter,
  selectLeadsLoading,
  selectLeadsSearch,
  setLeadFilter,
  setLeadSearch,
  setLeadsError,
  setLeadsLoading,
  updateLead,
  updateLeadStatus
};
