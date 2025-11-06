import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { 
        token: null, 
        email: null, 
        username: null,
        createdAt: null, 
        avatar: null,
        notationIcon: 'heart',
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
            state.value.notationIcon = action.payload.notationIcon;
        },
        /* Pour la déconnexion */
        logout: (state) => {           
            state.value.token = null;
            state.value.email = null;
            state.value.username = null;
            state.value.createdAt = null;
            state.value.avatar = null;
            state.value.notationIcon = null;
        },
        updateAvatar: (state, action) => {
            state.value.avatar = action.payload;
        },
        updateUsername: (state, action) => {
            state.value.username = action.payload;
        },
        updateEmail: (state, action) => {
            state.value.email = action.payload;
        },
        updateNotationIcon: (state, action) => {
            state.value.notationIcon = action.payload;
        },
    },
});

export const { login, logout, updateAvatar, updateUsername, updateEmail, updateNotationIcon } = userSlice.actions;
export default userSlice.reducer;
