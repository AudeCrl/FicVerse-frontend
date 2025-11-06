// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { 
    ignores: ['node_modules/**', 'android/**', 'ios/**', 'dist/**', 'build/**'] // remplace .eslintignore
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },                         // active JSX
      globals: { 
        ...globals.browser, 
        ...globals.node, 
        __DEV__: true, 
        require: 'readonly'                                                   // évite no-undef sur require()
      },
    },
    plugins: { 
      react, 
      'react-hooks': reactHooks, 
      'react-native': reactNative 
    },
    settings: { 
      react: { version: 'detect' }                                            // supprime le warning version React
    },
    rules: {
      // bases
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React moderne
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // ⚠️ Celle que tu veux garder en "erreur" (texte hors <Text>)
      'react-native/no-raw-text': 'error',

      // ↓ Calmer les nouvelles règles "React Compiler" pour passer clean sans refactor massif
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/exhaustive-deps': 'warn', // utile mais pas bloquant

      // un peu de confort
      'react-native/no-inline-styles': 'off',
      'react-native/no-color-literals': 'off',
      'react/no-children-prop': 'warn',          // (était en error chez toi)
      'react/no-unescaped-entities': 'warn',     // (apostrophes, etc.)

      // bruit commun
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    }
  },
]);
