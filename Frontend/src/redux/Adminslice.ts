import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
    admin: {
        _id: string;
        email: string;
        isAdmin: boolean;
    } | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AdminState = {
    admin: null,
    accessToken: null,
    isAuthenticated: false
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdmin: (state, action: PayloadAction<{ admin: AdminState['admin']; accessToken: string }>) => {
            state.admin = action.payload.admin;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },
        logoutAdmin: (state) => {
            state.admin = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;