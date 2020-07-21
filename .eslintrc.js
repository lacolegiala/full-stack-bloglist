module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2020': true,
		'es6': true,
		'node': true,
		'jest': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended'
	],
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 11
	},
	'plugins': [
		'react'
	],
	'rules': {
		'indent': [
			'error',
			'space'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
