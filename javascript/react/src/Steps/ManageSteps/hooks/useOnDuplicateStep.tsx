/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableStore } from '@data-wrangling-components/core'
import { useCallback } from 'react'
import {
	useCreateTableName,
	useFormatedColumnArgWithCount,
} from '../../../common/index.js'
import { StepsType } from '../../../index.js'

export function useOnDuplicateStep(
	store: TableStore,
	type: StepsType,
	onSave?: (step: Step, index?: number) => void,
): (_step: Step) => void {
	const createTableName = useCreateTableName(store)
	const formattedColumnArgs = useFormatedColumnArgWithCount()

	return useCallback(
		async (_step: Step) => {
			const tableName = createTableName(_step.output)
			const table = await store.get(_step.output)
			const formattedArgs = await formattedColumnArgs(
				_step,
				table.columnNames(),
			)
			const dupStep = {
				..._step,
				args: formattedArgs,
				input: _step.output,
				output: type === StepsType.Table ? tableName : _step.output,
			}
			onSave && onSave(dupStep)
		},
		[onSave, createTableName, formattedColumnArgs, type, store],
	)
}
