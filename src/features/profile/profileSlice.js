import { createSlice } from "@reduxjs/toolkit";
import { PROFILE_STORAGE_KEY } from "../../constants/auth";
function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return defaultSettings();
    return { ...defaultSettings(), ...JSON.parse(raw) };
  } catch {
    return defaultSettings();
  }
}
function defaultSettings() {
  return {
    phone: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    emailDigest: true,
    taskReminders: true,
    meetingAlerts: true
  };
}
function saveProfile(settings) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(settings));
  } catch {
  }
}
const initialState = {
  settings: loadProfile()
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileSettings(state, action) {
      state.settings = { ...state.settings, ...action.payload };
      saveProfile(state.settings);
    },
    resetProfileSettings(state) {
      state.settings = defaultSettings();
      saveProfile(state.settings);
    }
  }
});
const { updateProfileSettings, resetProfileSettings } = profileSlice.actions;
const selectProfileSettings = (state) => state.profile.settings;
var stdin_default = profileSlice.reducer;
export {
  stdin_default as default,
  resetProfileSettings,
  selectProfileSettings,
  updateProfileSettings
};
