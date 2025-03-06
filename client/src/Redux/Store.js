import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState: { isDarkMode: false },
  reducers: {
    enableDarkMode(state) {
      state.isDarkMode = true;
    },
    disableDarkMode(state) {
      state.isDarkMode = false;
    },
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { login, logout } = authSlice.actions;
export const { enableDarkMode, disableDarkMode, toggleDarkMode } = darkModeSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    darkMode: darkModeSlice.reducer,
  },
});
