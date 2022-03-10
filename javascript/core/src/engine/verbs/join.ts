/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinOptions } from 'arquero/dist/types/table/transformable'

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { JoinArgs, Step, TableContainer } from '../../types.js'
import { JoinStrategy } from '../../types.js'

/**
 * Executes an arquero join.
 * @param step
 * @param store
 * @returns
 */
export async function join(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { other, on, strategy = JoinStrategy.Inner } = args as JoinArgs
	const [inputTable, otherTable] = await Promise.all([
		store.table(input),
		store.table(other),
	])

	const options: JoinOptions = {
		left:
			strategy === JoinStrategy.LeftOuter ||
			strategy === JoinStrategy.FullOuter,
		right:
			strategy === JoinStrategy.RightOuter ||
			strategy === JoinStrategy.FullOuter,
	}

	return container(output, inputTable.join(otherTable, on, undefined, options))
}
