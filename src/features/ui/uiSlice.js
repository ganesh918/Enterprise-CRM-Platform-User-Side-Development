import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  sidebarCollapsed: false,
  mobileNavOpen: false,
  globalSearch: ""
};
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileNavOpen(state, action) {
      state.mobileNavOpen = action.payload;
    },
    setGlobalSearch(state, action) {
      state.globalSearch = action.payload;
    }
  }
});
const { toggleSidebar, setMobileNavOpen, setGlobalSearch } = uiSlice.actions;
const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
const selectMobileNavOpen = (state) => state.ui.mobileNavOpen;
var stdin_default = uiSlice.reducer;
export {
  stdin_default as default,
  selectMobileNavOpen,
  selectSidebarCollapsed,
  setGlobalSearch,
  setMobileNavOpen,
  toggleSidebar
};
