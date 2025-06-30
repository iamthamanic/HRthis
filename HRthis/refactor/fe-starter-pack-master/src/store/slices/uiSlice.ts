import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Define the state interface
interface UiState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  currentPage: string;
}

// Define the initial state
const initialState: UiState = {
  sidebarOpen: false,
  theme: "light",
  loading: {
    global: false,
  },
  currentPage: "",
};

// Create slice
export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarState: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarState,
  setTheme,
  setLoading,
  setGlobalLoading,
  setCurrentPage,
} = uiSlice.actions;

// Export selectors
export const selectSidebarOpen = (state: RootState) => state.ui?.sidebarOpen;
export const selectTheme = (state: RootState) => state.ui?.theme;
export const selectLoading = (state: RootState) => state.ui?.loading;
export const selectCurrentPage = (state: RootState) => state.ui?.currentPage;

// Export reducer
export default uiSlice.reducer;
