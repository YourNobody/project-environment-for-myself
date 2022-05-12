/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-unresolved */
const {isProdMode} = require('./webpack/common.helper');

/** @type {import('eslint').Linter.Config} */
module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		project: './tsconfig.json',
		ecmaFeatures: {
			jsx: true,
		},
	},
	extends: ['eslint:recommended', 'airbnb', 'prettier', 'plugin:@typescript-eslint/recommended'],
	env: {
		es6: true,
		node: true,
		browser: true,
	},
	globals: {
		DEV_SERVER: true,
		API_DOMAIN: true,
	},
	plugins: ['json', 'prettier', 'import', '@typescript-eslint', 'unused-imports'],
	rules: {
		'@typescript-eslint/no-explicit-any': [
			'error',
			{
				fixToUnknown: true,
				ignoreRestArgs: false,
			},
		],
		'@typescript-eslint/no-use-before-define': 'error',
		'require-await': 'error',
		'no-restricted-syntax': 0,
		'react/jsx-filename-extension': ['error', {extensions: ['.tsx', '.jsx']}],
		'react/destructuring-assignment': 0,
		// "react/jsx-max-props-per-line": [1, { maximum: 1 }], //it doesn't work with prettier, you can remove prettier from rules: 'prettier/prettier'...
		// "react/jsx-first-prop-new-line": [1, "multiline"], //it doesn't work with prettier, you can remove prettier from rules: 'prettier/prettier'...
		'react/prop-types': 0,
		'react/prefer-stateless-function': 0,
		'react/react-in-jsx-scope': 0,
		'react/function-component-definition': 0,
		'react/jsx-props-no-spreading': 0,
		'react/jsx-curly-newline': 0, // it conflicts with prettier
		'react/jsx-wrap-multilines': ['error', {arrow: true, return: true, declaration: true}],
		'spaced-comment': ['error', 'always'],
		'unused-imports/no-unused-imports': 'error',
		'no-underscore-dangle': 0,
		'no-unused-expressions': ['error', {allowShortCircuit: true}],
		'no-console': 'warn',
		'no-debugger': isProdMode() ? 'error' : 'warn',
		'no-alert': isProdMode() ? 'error' : 'warn',
		'no-plusplus': 0,
		'class-methods-use-this': 0,
		'max-len': [
			'warn',
			{
				code: 120,
				tabWidth: 2,
				comments: 1000,
				ignoreComments: true,
				ignoreTrailingComments: true,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreRegExpLiterals: true,
			},
		],
		'import/extensions': [
			'error',
			'ignorePackages',
			['.vue', '.js', '.jsx', '.ts', '.tsx']
		],
		'consistent-return': 'off',
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx', '.vue'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
				project: ['./tsconfig.json'],
			},
		},
	},
};
