import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        token: null,
        email: null,
        username: null,
        createdAt: null,
        avatar: null,
        notationIcon: 'heart',
        theme: 'watercolor',
        appearanceMode: 'light',
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
            state.value.theme = action.payload.theme;
            state.value.appearanceMode = action.payload.appearanceMode;
        },
        /* Pour la déconnexion */
        logout: (state) => {
            state.value.token = null;
            state.value.email = null;
            state.value.username = null;
            state.value.createdAt = null;
            state.value.avatar = null;
            state.value.notationIcon = null;
            state.value.theme = null;
            state.value.appearanceMode = null;
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
        updateTheme: (state, action) => {
            state.value.theme = action.payload;
        },
        updateAppearanceMode: (state, action) => {
            state.value.appearanceMode = action.payload;
        }
    },
});

export const { login, logout, updateAvatar, updateUsername, updateEmail, updateNotationIcon, updateTheme, updateAppearanceMode } = userSlice.actions;
export default userSlice.reducer;
