/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/jest-config')
module.exports = {
	projects: [
		{
			...configure(),
			displayName: 'dom',
			testEnvironment: 'jsdom',
			testMatch: ['**/__tests__/**/*.test.ts'],
			setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
		},
		{
			...configure(),
			displayName: 'node',
			testEnvironment: 'node',
			testMatch: ['**/__tests__/**/*.spec.ts'],
		},
	],
}
