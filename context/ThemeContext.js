import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleVariant, setThemeName } from '../reducers/theme';
import { themes } from '../styles/themes';

// Create a new context for theming
const ThemeContext = createContext();

// ThemeProvider wraps the entire app and provides
// theme-related data and functions (light/dark mode, themeName, etc.)
export const ThemeProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { themeName, variant } = useSelector((state) => state.theme);
    console.log(themeName);

    // Get the currently active theme object (ex: themes.watercolor.light)
    const currentTheme = themes[themeName][variant];

    return (
        <ThemeContext.Provider
        // value = unique prop obligatoire de Provider
        // on y met ttes les valeurs à diffuser aux children
        // Pour les récupérer : useTheme
            value={{
                themeName,
                variant,
                currentTheme, // le gros objet qui contient toutes les valeurs de couleurs du thème courant
                setThemeName: (name) => dispatch(setThemeName(name)), // la fonction pour changer de thème
                toggleVariant: () => dispatch(toggleVariant()), // la fonction pour basculer le mode light/dark
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for accessing the theme context easily
// Usage: const { currentTheme, toggleVariant } = useTheme();
export const useTheme = () => useContext(ThemeContext);