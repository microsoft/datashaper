/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { configure } from '@essex/jest-config'
const config = {
	...configure({ setupFiles: ['./jest.setup.mjs'] }),
	displayName: 'core',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*.spec.ts'],
}
export default config
