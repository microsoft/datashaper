/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { all } from 'arquero'

import type { SelectArgs } from '../../types.js'
import { makeStepNode } from '../factories.js'

export const select = makeStepNode<SelectArgs>((input, { columns = [] }) => {
	const expr = [columns] as any
	if (expr.length === 0) {
		expr.push(all())
	}
	return input.select(...expr)
})
