/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@datashaper/schema'
import { JoinStrategy } from '@datashaper/schema'

export const join = (): JoinArgs => ({
	on: [],
	strategy: JoinStrategy.Inner,
})
