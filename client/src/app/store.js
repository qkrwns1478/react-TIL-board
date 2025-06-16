import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feat/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;