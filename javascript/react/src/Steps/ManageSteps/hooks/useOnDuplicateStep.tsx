/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableStore } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import {
	useCreateTableName,
	useFormatedColumnArgWithCount,
} from '../../../common/index.js'
import { StepsType } from '../../../index.js'

export function useOnDuplicateStep(
	type: StepsType,
	store?: TableStore,
	table?: ColumnTable,
	onSave?: (step: Step, index?: number) => void,
): (_step: Step) => void {
	const createTableName = useCreateTableName(store)
	const formattedColumnArgs = useFormatedColumnArgWithCount()

	return useCallback(
		(_step: Step) => {
			const tableName =
				type === StepsType.Table ? createTableName(_step.id) : _step.id

			const outputTable = store ? store.get(_step.id)?.table : table
			const formattedArgs = formattedColumnArgs(
				_step,
				outputTable?.columnNames() ?? [],
			)
			const newStep = {
				..._step,
				args: formattedArgs,
				inputs: { source: { node: _step.id } },
				outputs: { target: tableName },
			}
			onSave && onSave(newStep)
		},
		[onSave, createTableName, formattedColumnArgs, type, store, table],
	)
}
