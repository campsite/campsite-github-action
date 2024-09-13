/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: ["eslint:recommended"],
	plugins: ["unused-imports"],
	parserOptions: { project: true },
	env: {
		es2022: true,
		node: true,
	},
	rules: {
		"no-irregular-whitespace": "error",
		"no-empty-function": "error",
		"newline-after-var": "error",
		"no-unused-vars": "off",
		"no-fallthrough": ["error", { allowEmptyCase: true }],
		"no-extra-semi": "off",
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{
				vars: "all",
				varsIgnorePattern: "^_",
				args: "after-used",
				argsIgnorePattern: "^_",
			},
		],
	},
	overrides: [
		{
			files: ["**/test/**/*"],
			env: {
				jest: true,
			},
		},
		{
			files: ["**/*.{js}"],
			rules: {
				"no-undef": "off",
				"no-redeclare": "off",
			},
		},
	],
	ignorePatterns: [".*.js", "node_modules/", "dist/"],
};
