import { createSelector, createSlice } from "@reduxjs/toolkit";
import { initialCustomers } from "../../data/seed";
import { generateId } from "../../lib/utils";
const initialState = {
  items: initialCustomers,
  search: "",
  loading: false,
  error: null
};
const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomerSearch(state, action) {
      state.search = action.payload;
    },
    setCustomersLoading(state, action) {
      state.loading = action.payload;
    },
    setCustomersError(state, action) {
      state.error = action.payload;
    },
    addCustomer(state, action) {
      state.items.unshift({
        ...action.payload,
        id: generateId("cust"),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    },
    updateCustomer(state, action) {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteCustomer(state, action) {
      state.items = state.items.filter((c) => c.id !== action.payload);
    }
  }
});
const {
  setCustomerSearch,
  setCustomersLoading,
  setCustomersError,
  addCustomer,
  updateCustomer,
  deleteCustomer
} = customersSlice.actions;
const selectAllCustomers = (state) => state.customers.items;
const selectCustomerById = (id) => (state) => state.customers.items.find((c) => c.id === id);
const selectFilteredCustomers = createSelector(
  [
    (state) => state.customers.items,
    (state) => state.customers.search,
    (state) => state.ui.globalSearch
  ],
  (items, search, globalSearch) => {
    const q = (search || globalSearch).trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
    );
  }
);
var stdin_default = customersSlice.reducer;
export {
  addCustomer,
  stdin_default as default,
  deleteCustomer,
  selectAllCustomers,
  selectCustomerById,
  selectFilteredCustomers,
  setCustomerSearch,
  setCustomersError,
  setCustomersLoading,
  updateCustomer
};
