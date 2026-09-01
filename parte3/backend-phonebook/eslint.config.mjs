import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    js.configs.recommended,
    stylistic.configs['recommended'],
    {
        files: ['**/*.{js,cjs,msj}'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
        plugins: {
        '@stylistic': stylistic,
        },
        rules: {
        'eqeqeq': 'error',
        '@stylistic/no-trailing-spaces': 'error',
        '@stylistic/object-curly-spacing': ['error', 'always'],
        '@stylistic/arrow-spacing': ['error', { 'before': true, 'after': true }],
        'no-console': 0,
        '@stylistic/indent': 'off',
        '@stylistic/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
        },
    },
    { ignores: ['dist/**'] },
    {
        files: ['**/*.mjs'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            '@stylistic/indent': 'off',
        }
    },
]);