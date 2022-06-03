/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '../bin.js'
import { BinStrategy } from '../bin.js'

export const bin = (): Omit<BinArgs, 'column' | 'to'> => {
	return {
		strategy: BinStrategy.Auto,
		fixedcount: 10,
	}
}
