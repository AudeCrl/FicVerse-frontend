import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { 
        token: null, 
        email: null, 
        username: null,
        createdAt: null, 
        avatar: null,
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {            
            state.value.token = action.payload.token;
            state.value.email = action.payload.email;
            state.value.username = action.payload.username;
            state.value.createdAt = action.payload.createdAt;
            state.value.avatar = action.payload.avatarURL;
        },
        /* Pour la déconnexion */
        logout: (state) => {           
            state.value.token = null;
            state.value.email = null;
            state.value.username = null;
            state.value.createdAt = null;
            state.value.avatar = null;
        },
        updateAvatar: (state, action) => {
            state.value.avatar = action.payload;
        }
    },
});

export const { login, logout, updateAvatar } = userSlice.actions;
export default userSlice.reducer;
