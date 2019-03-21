const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);
module.exports = {
	"transform": {
		"^.+\\.tsx?$": "ts-jest"
	},
	// Setup Enzyme
	"snapshotSerializers": ["enzyme-to-json/serializer"],
	"setupFilesAfterEnv": [
		"<rootDir>/test.config.ts"
	],
	"testRegex": "(/__tests__/.*|(\\.|/|-)(test|spec))\\.tsx?$",
	"moduleFileExtensions": [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json"
	],
	"moduleNameMapper": {
		...moduleNameMapper,
		"\\.(css|scss|sass|jpg|png|svg)$": "<rootDir>/node_modules/jest-css-modules"
	},
};
