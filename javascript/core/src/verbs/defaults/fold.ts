/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '../fold.js'
import { inputColumnList } from './inputColumnList.js'

export const fold = (): FoldArgs => {
	return {
		to: ['key', 'value'],
		...inputColumnList(),
	}
}
