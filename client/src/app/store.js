import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../feat/counterSlice";
import authReducer from "../feat/authSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        auth: authReducer,
    },
});

export default store;