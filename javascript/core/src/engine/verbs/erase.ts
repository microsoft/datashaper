/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { escape } from 'arquero'

import { container } from '../../factories.js'
import type { EraseStep, TableContainer, TableStore } from '../../types.js'

/**
 * Executes an arquero erase operation.
 * @param step
 * @param store
 * @returns
 */

export async function erase(
	{ input, output, args: { value, column } }: EraseStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	const func = escape((d: any) => (d[column] === value ? undefined : d[column]))

	const dArgs = {
		[column]: func,
	}

	return container(output, inputTable.derive(dArgs))
}
