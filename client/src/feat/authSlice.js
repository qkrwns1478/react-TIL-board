import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        accessToken: undefined,
        username: null,
        name: null,
        id: null,
        gender: null,
        age: null,
        isLoggedIn: false,
    },
    reducers: {
        setCredentials: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.username = action.payload.username;
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.gender = action.payload.gender;
            state.age = action.payload.age;
            state.isLoggedIn = true;
        },
        clearAuth: (state) => {
            state.accessToken = null;
            state.username = null;
            state.name = null;
            state.id = null;
            state.gender = null;
            state.age = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;