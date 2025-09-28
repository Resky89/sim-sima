import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  csrfToken: null,
  isAuthenticated: false,
  loading: true, // Mulai dengan loading true untuk pengecekan sesi awal
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, accessToken, csrfToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.csrfToken = csrfToken;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logOut(state) {
      state.user = null;
      state.accessToken = null;
      state.csrfToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, logOut, setLoading } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentAccessToken = (state) => state.auth.accessToken;
export const selectCurrentCsrfToken = (state) => state.auth.csrfToken;
export const selectIsAuthLoading = (state) => state.auth.loading;
