import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { 
        token: null, 
        email: null, 
        username: null, 
      //  avatar: null,     On a l'avatar par défaut ?
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
           // state.value.avatar = action.payload.avatar;
        },
        /* Pour la déconnexion */
        logout: (state) => {           
            state.value.token = null;
            state.value.email = null;
            state.value.username = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
