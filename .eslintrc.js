module.exports = {
	extends: ["plugin:@wordpress/recommended"],
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: "module"
	},
	globals: {
		$: "readonly",
		jQuery: "readonly",
		wp: true
	},
	plugins: ["react-hooks"],
	settings: {
		react: {
			version: "detect"
		}
	},
	rules: {
		"arrow-spacing": [1, { before: true, after: true }],
		"camelcase": [2, { properties: "never" }],
		"indent": [1, "tab", { SwitchCase: 1 }],
		"lines-around-comment": [0],
		"jsdoc/require-param": [0],
		"jsdoc/require-param-type": [0],
		"jsdoc/require-returns-description": [0],
		"jsdoc/check-tag-names": [1, { definedTags: ["notice", "link", "task", "ticket", "note"] }],
		"import/no-unresolved": [0],
		"no-console": [0],
		"no-multiple-empty-lines": ["error", { max: 2 }],
		"no-shadow": "off",
		"object-curly-spacing": ["error", "always"],
		"prettier/prettier": "off",
		"react/no-unescaped-entities": [2, { forbid: [">", "}"] }],
		"react/display-name": [0],
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
		"react/jsx-curly-spacing": [1, { when: "always", allowMultiline: false, children: true }],
		"react/prop-types": [2, { skipUndeclared: true }],
		"space-before-blocks": [1, "always"],
		"space-before-function-paren": ["error", {
			anonymous: "never",
			asyncArrow: "ignore",
			named: "never"
		}],
		"space-in-parens": [2, "always"],
		"template-curly-spacing": [1, "never"],
		"yoda": [2, "always", { onlyEquality: true }]
	},
	overrides: [
		{
			files: ["**/*.ts", "**/*.tsx"],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				project: "./tsconfig.json"
			},
			plugins: ["@typescript-eslint"],
			rules: {
				"@typescript-eslint/explicit-function-return-type": "error",
				"@typescript-eslint/no-unused-vars": "warn",
				"@typescript-eslint/no-explicit-any": "warn"
			}
		}
	],
	ignorePatterns: [
		"build/",
		"vendor/",
		"node_modules/"
	]
};
