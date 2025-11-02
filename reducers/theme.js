import { createSlice } from '@reduxjs/toolkit';
import { themes } from '../styles/themes';

const initialState = {
    themeName: 'watercolor',
    variant: 'light',
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeName: (state, action) => {
            state.themeName = action.payload
        },
        toggleVariant: (state) => {
            state.variant = state.variant === 'light' ? 'dark' : 'light';
        },
        setVariant: (state, action) => {
            state.variant = action.payload
        },
    },
});

export const { setThemeName, toggleVariant, setVariant } = themeSlice.actions;
export default themeSlice.reducer;