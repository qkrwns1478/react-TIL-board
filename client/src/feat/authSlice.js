import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        accessToken: null,
        username: null,
        isLoggedIn: false,
    },
    reducers: {
        setCredentials: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.username = action.payload.username;
            state.isLoggedIn = true;
        },
        clearAuth: (state) => {
            state.accessToken = null;
            state.username = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;