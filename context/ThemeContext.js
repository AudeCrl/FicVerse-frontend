import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTheme, updateAppearanceMode } from '../reducers/user';
import { themes } from '../styles/themes';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Create a new context for theming
const ThemeContext = createContext();

// ThemeProvider wraps the entire app and provides
// theme-related data and functions (light/dark mode, themeName, etc.)
export const ThemeProvider = ({ children }) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.value.token);
    const themeName = useSelector((state) => state.user.value.theme) || 'watercolor';
    const variant = useSelector((state) => state.user.value.appearanceMode) || 'light';

    // Get the currently active theme object (ex: themes.watercolor.light)
    const currentTheme = themes[themeName]?.[variant] || themes.watercolor.light;

    const toggleVariant = async () => {
        const newVariant = variant === 'light' ? 'dark' : 'light';

        // Optimistic update - UI réactive immédiate
        dispatch(updateAppearanceMode(newVariant));

        // Sauvegarde en BDD
        try {
            const response = await fetch(`${API_URL}/user/appearance-mode`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ appearanceMode: newVariant }),
            });
            const data = await response.json();

            if (!data.result) {
                // Rollback si erreur
                dispatch(updateAppearanceMode(variant));
            }
        } catch (error) {
            console.error('Error updating appearance mode:', error);
            dispatch(updateAppearanceMode(variant));
        }
    };

    return (
        <ThemeContext.Provider
        // value = unique prop obligatoire de Provider
        // on y met ttes les valeurs à diffuser aux children
        // Pour les récupérer : useTheme
            value={{
                themeName,
                variant,
                currentTheme, // le gros objet qui contient toutes les valeurs de couleurs du thème courant
                setThemeName: (name) => dispatch(updateTheme(name)), // la fonction pour changer de thème
                toggleVariant, // la fonction pour basculer le mode light/dark
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for accessing the theme context easily
// Usage: const { currentTheme, toggleVariant } = useTheme();
export const useTheme = () => useContext(ThemeContext);