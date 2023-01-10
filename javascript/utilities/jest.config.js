/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { configure } from '@essex/jest-config'
const config = {
	...configure({ setupFiles: ['./jest.setup.mjs'] }),
	displayName: 'utilities',
	testEnvironment: 'jsdom',
	testMatch: ['**/__tests__/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
}
export default config
