module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"commonjs": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 11,
		"sourceType": "module"
	},
	"rules": {
		"arrow-spacing": "error",
		"no-duplicate-imports": ["error",
			{ 
				"includeExports": true
			}],
		"prefer-destructuring": ["error", {
			"array": false,
			"object": true
		}],
		"no-useless-constructor": "error",
		"prefer-template": "error",
		"no-useless-concat":"error",
		"no-console":"off",
		"semi": [
			"error",
			"always"
		],
		"quotes": [
			"error",
			"double"
		],
		"indent":[
			"error",
			"tab"
		],
		"comma-dangle": [
			"error",
			"never"
		],
		"eol-last": [
			"error",
			"always"
		],
		"comma-spacing": ["error",
			{
				"before": false,
				"after": true
			}]
	}
};
