/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '../join.js'
import { JoinStrategy } from '../join.js'

export const join = (): JoinArgs => ({
	on: [],
	strategy: JoinStrategy.Inner,
})
