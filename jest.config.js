/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/jest-config')
module.exports = {
	...configure(),
	projects: [
		{
			displayName: 'dom',
			testEnvironment: 'jsdom',
			testMatch: ['**/__tests__/**/*.test.ts'],
			extensionsToTreatAsEsm: ['.ts'],
			setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
		},
		{
			displayName: 'node',
			testEnvironment: 'node',
			testMatch: ['**/__tests__/**/*.spec.ts'],
		},
	],
}
