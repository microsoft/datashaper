/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { configure } from '@essex/jest-config'
const config = configure({})
export default {
    ...config,
    testMatch: ['**/*.spec.ts'],
}
